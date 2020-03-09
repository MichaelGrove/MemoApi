import AuthService from "../services/AuthService";

export default async (req: any, res: any, next: any) => {
    const authService = new AuthService();
    const headers = req.headers || {};
    const authorization = headers.authorization || "";
    if (!authorization) {
        return res.status(403).json({ error: "Unauthorised!" });
    }

    const token = authorization.replace("Bearer ", "");
    if (!token) {
        return res.status(403).json({ error: "Unauthorised!" });
    }

    if (authService.verifyToken(token)) {
        next();
    } else {
        return res.status(403).json({ error: "Unauthorised!" });
    }
};
