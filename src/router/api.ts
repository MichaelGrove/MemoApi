import express from "express";
import CategoryController from "../controllers/CategoryController";
import MemoController from "../controllers/MemoController";
import isAuthorized from "../middleware/is-authorized";
import requireAuth from "../middleware/require-authorization";
import validate from "../validate";
import categoryValidators from "../validators/category";
import memoValidators from "../validators/memo";

const router = express.Router();

const memoController = new MemoController();
const categoryController = new CategoryController();

router.get("/memo/", isAuthorized, memoController.index.bind(memoController));
router.get("/memo/:id", memoController.edit.bind(memoController));
router.post("/memo", [requireAuth, validate(memoValidators)], memoController.create.bind(memoController));
router.put("/memo/:id", [requireAuth, validate(memoValidators)], memoController.update.bind(memoController));
router.delete("/memo/:id", requireAuth, memoController.delete.bind(memoController));
router.get("/category", requireAuth, categoryController.index.bind(categoryController));
router.get("/category/:id", requireAuth, categoryController.edit.bind(categoryController));
router.post(
    "/category",
    [requireAuth, validate(categoryValidators)],
    categoryController.create.bind(categoryController)
);
router.put(
    "/category/:id",
    [requireAuth, validate(categoryValidators)],
    categoryController.update.bind(categoryController)
);
router.delete("/category/:id", requireAuth, categoryController.delete.bind(categoryController));

export default router;
