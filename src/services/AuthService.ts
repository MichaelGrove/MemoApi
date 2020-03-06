import fs from "fs";
import jwt from "jsonwebtoken";
import config from "../config";

class AuthService {
    public generateToken(data: any) {
        try {
            const privateKey = this.getPrivateKey();
            return jwt.sign(data, privateKey, {
                issuer: config.jwt.issuer,
                expiresIn: config.jwt.expiresIn,
                algorithm: "RS256"
            });
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.log("Error signing jwt token:", e);
            return null;
        }
    }

    public verifyToken(token: string): string|object|null {
        try {
            const publicKey = this.getPublicKey();
            return jwt.verify(token, publicKey);
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.log("Error verifying jwt token:", e);
            return null;
        }
    }

    private getPublicKey(): string {
        return fs.readFileSync(process.cwd() + "/public.key", "utf-8");
    }

    private getPrivateKey(): string {
        return fs.readFileSync(process.cwd() + "/private.key", "utf-8");
    }
}

export default AuthService;
