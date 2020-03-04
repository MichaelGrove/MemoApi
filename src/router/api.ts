import express from "express";
import CategoryController from "../controllers/CategoryController";
import MemoController from "../controllers/MemoController";
import isAuthorized from "../middleware/is-authorized";
import requireAuth from "../middleware/require-authorization";

const router = express.Router();

const memoController = new MemoController();
const categoryController = new CategoryController();
router.post("/memo/", isAuthorized, memoController.index.bind(memoController));
router.post("/memo/edit/:id", memoController.edit.bind(memoController));
router.post("/memo/create", requireAuth, memoController.create.bind(memoController));
router.post("/memo/update/:id", requireAuth, memoController.update.bind(memoController));
router.post("/memo/delete/:id", requireAuth, memoController.delete.bind(memoController));
router.post("/category/", requireAuth, categoryController.index.bind(categoryController));
router.post("/category/edit/:id", requireAuth, categoryController.edit.bind(categoryController));
router.post("/category/create", requireAuth, categoryController.create.bind(categoryController));
router.post("/category/update/:id", requireAuth, categoryController.update.bind(categoryController));
router.post("/category/delete/:id", requireAuth, categoryController.delete.bind(categoryController));

export default router;
