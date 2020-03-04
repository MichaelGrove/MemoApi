import express from "express";
import AuthController from "../controllers/AuthController";
const router = express.Router();
const controller = new AuthController();
router.post("/login", controller.login.bind(controller));
export default router;
