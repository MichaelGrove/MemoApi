import { check } from "express-validator";

export default [
    check("email", "Email is required").isString().isEmail(),
    check("password", "Password is required").not().isEmpty().isString()
];
