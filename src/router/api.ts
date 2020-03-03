import express from "express";
import CategoryController from "../controllers/CategoryController";
import MemoController from "../controllers/MemoController";
import authorize from "../middleware/authorize";
import isAuthorized from "../middleware/is-authorized";

const router = express.Router();

const memoController = new MemoController();
const categoryController = new CategoryController();
router.post("/memo/", isAuthorized, memoController.index.bind(memoController));
router.post("/memo/edit/:id", authorize, memoController.edit.bind(memoController));
router.post("/memo/create", authorize, memoController.create.bind(memoController));
router.post("/memo/update/:id", authorize, memoController.update.bind(memoController));
router.post("/memo/delete/:id", authorize, memoController.delete.bind(memoController));
router.post("/category/", authorize, categoryController.index.bind(categoryController));
router.post("/category/edit/:id", authorize, categoryController.edit.bind(categoryController));
router.post("/category/create", authorize, categoryController.create.bind(categoryController));
router.post("/category/update/:id", authorize, categoryController.update.bind(categoryController));
router.post("/category/delete/:id", authorize, categoryController.delete.bind(categoryController));

export default router;
