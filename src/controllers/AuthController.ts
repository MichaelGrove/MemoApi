import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { getManager } from "typeorm";
import { User } from "../entity/User";
import AuthService from "../services/AuthService";

interface IAuthRequest {
    email: string;
    password: string;
}

class AuthController {

    private auth: AuthService;

    constructor() {
        this.auth = new AuthService();
    }

    public async login(req: Request, res: Response): Promise<any> {
        const body = req.body as IAuthRequest;
        const email = String(body.email);
        const password = String(body.password);
        if (!email) {
            return res.json({ error: "Email is missing!" });
        }

        if (!password) {
            return res.json({ error: "Password is missing!" });
        }

        const repo = getManager().getRepository(User);
        const user = await repo.findOne({ email });
        if (!user) {
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

export default AuthController;
