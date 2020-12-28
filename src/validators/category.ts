import { body } from "express-validator";

export default [
    body("label", "'Label' is required").isString().trim().escape().not().isEmpty()
];
