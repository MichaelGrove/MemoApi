import AuthService from "../services/AuthService";

export default async (req: any, res: any, next: any) => {
    const authService = new AuthService();
    const headers = req.headers || {};
    const authorization = headers.authorization || "";

    req.isAuthorized = false;
    const token = authorization.replace("Bearer ", "");
    if (authService.verifyToken(token)) {
        req.isAuthorized = true;
    }

    next();
};
