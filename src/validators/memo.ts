import { check } from "express-validator";

export default [
    check("title", "'Title' is required").isString().trim().escape().not().isEmpty(),
    check("message", "'Message' is required").isString().trim().escape().not().isEmpty(),
    check("isFavourite", "'Is Favourite' needs to be a number").isInt(),
    check("isHidden", "'Is Hidden' needs to be a number").isInt(),
    check("categories", "'Categories' needs to be an array").isArray().custom((cids) => {
        return cids.filter((cid: any) => !isNaN(cid)).map((cid: number) => Number(cid));
    }),
];
