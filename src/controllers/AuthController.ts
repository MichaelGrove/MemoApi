import bcrypt from "bcrypt";
import Connection from "..//database/Connection";
import UserFactory from "../factories/UserFactory";
import UserRepository from "../repositories/UserRepository";
import AuthService from "../services/AuthService";

import { IUser } from "../models/User";

class AuthController {

    private conn: Connection;
    private auth: AuthService;

    constructor() {
        this.conn = new Connection();
        this.auth = new AuthService();
    }

    public async login(req: any, res: any): Promise<any> {
        let body: IAuthRequest = null;
        if (Object.keys(req.body).length > 0) {
            body = req.body as IAuthRequest;
        } else if (Object.keys(req.query).length > 0) {
            body = req.query as IAuthRequest;
        } else {
            return res.json({ error: "Unexpected error" });
        }

        const email = String(body.email);
        const password = String(body.password);
        if (!email) {
            return res.send({ error: "Email is missing!" });
        }

        if (!password) {
            return res.send({ error: "Password is missing!" });
        }

        const repository = new UserRepository(this.conn);
        const user: IUser = await repository.getUserByEmail(email);
        if (user === null) {
            return res.json({ error: "Wrong sign in credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ error: "Wrong sign in credentials." });
        }

        const token = this.auth.generateToken({ uid: user.uid, email: user.email });

        return res.json({ token });
    }

    public async create(req: any, res: any) {
        let body: IAuthRequest = null;
        if (Object.keys(req.body).length > 0) {
            body = req.body as IAuthRequest;
        } else if (Object.keys(req.query).length > 0) {
            body = req.query as IAuthRequest;
        } else {
            return res.json({ error: "Unexpected error" });
        }

        const factory = new UserFactory();
        const user = factory.makeUser();
        user.displayName = body.displayName;
        user.email = body.email;
        user.password = body.password;

        // tslint:disable-next-line:no-console
        console.log(user);

        const repository = new UserRepository(this.conn);
        const salt = bcrypt.genSaltSync(10);
        user.password = bcrypt.hashSync(user.password, salt);
        const newUser = await repository.createUser(user);

        if (newUser.uid) {
            return res.json({ success: 1 });
        } else {
            return res.json({ error: "Unexpected error" });
        }
    }
}

interface IAuthRequest {
    displayName: string;
    email: string;
    password: string;
}

export default AuthController;
