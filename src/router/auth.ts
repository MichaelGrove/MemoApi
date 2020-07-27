import express from "express";
import AuthController from "../controllers/AuthController";
import validate from "../validate";
import loginValidators from "../validators/login";

const router = express.Router();
const controller = new AuthController();
router.post("/login", validate(loginValidators), controller.login.bind(controller));
router.post("/token", [], controller.token.bind(controller));
export default router;
