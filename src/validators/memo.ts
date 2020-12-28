import { body } from "express-validator";

export default [
    body("title", "'Title' is required").isString().trim().escape().not().isEmpty(),
    body("message", "'Message' is required").isString().trim().not().isEmpty(),
    body("isFavourite", "'Is Favourite' needs to be a number").isInt(),
    body("isHidden", "'Is Hidden' needs to be a number").isInt(),
    body("categories", "'Categories' needs to be an array").isArray().custom((cids) => {
        return cids.filter((cid: any) => !isNaN(cid)).map((cid: number) => Number(cid));
    }),
];
