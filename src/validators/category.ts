import { check } from "express-validator";

export default [
    check("label", "'Label' is required").isString().trim().escape().not().isEmpty(),
    check("color", "'color' is required").isString().trim().escape().not().isEmpty()
];
