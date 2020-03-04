import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/User";
import AuthService from "../services/AuthService";

class AuthController {

    private auth: AuthService;

    constructor() {
        this.auth = new AuthService();
    }

    public async login(req: Request, res: Response): Promise<any> {
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

        const repo = getManager().getRepository(User);
        const user = await repo.findOne({ email });
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
}

interface IAuthRequest {
    displayName: string;
    email: string;
    password: string;
}

export default AuthController;
