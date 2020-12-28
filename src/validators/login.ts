import { body } from "express-validator";

export default [
    body("email", "Email is required").isString().isEmail(),
    body("password", "Password is required").not().isEmpty().isString()
];
