import express from "express";
import AuthController from "../controllers/AuthController";

const router = express.Router();
const controller = new AuthController();
router.post("/login", controller.login.bind(controller));

// For creating the initial user
router.post("/create", controller.create.bind(controller));

router.post("*", async (req: any, res: any) => {
    return res.json({
        error: "404 route not found"
    });
});
router.get("*", async (req: any, res: any) => {
    return res.send({
        error: "404 Page not found"
    });
});

export default router;
