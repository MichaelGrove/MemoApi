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
            return res.status(422).json({
                errors: [
                    {
                        value: email,
                        msg: "Email is missing!",
                        param: "email",
                        location: "body"
                    }
                ]
            });
        }

        if (!password) {
            return res.status(422).json({
                errors: [
                    {
                        value: password,
                        msg: "Password is missing!",
                        param: "password",
                        location: "body"
                    }
                ]
            });
        }

        const repo = getManager().getRepository(User);
        const user = await repo.findOne({ email });
        if (!user) {
            return res.status(422).json({
                errors: [
                    {
                        value: "",
                        msg: "Wrong sign in credentials.",
                        param: "",
                        location: "body"
                    }
                ]
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(422).json({
                errors: [
                    {
                        value: "",
                        msg: "Wrong sign in credentials.",
                        param: "",
                        location: "body"
                    }
                ]
            });
        }

        const token = this.auth.generateToken({ uid: user.uid, email: user.email });

        return res.json({ token });
    }
}

export default AuthController;
