import express from "express";
import MemoController from "../controllers/MemoController";
import authorize from "../middleware/authorize";

const router = express.Router();

router.use(authorize);

const controller = new MemoController();
router.post("/", controller.index.bind(controller));
router.post("/edit/:id", controller.edit.bind(controller));
router.post("/create", controller.create.bind(controller));
router.post("/update/:id", controller.update.bind(controller));
router.post("/delete/:id", controller.delete.bind(controller));
router.post("*", async (req: any, res: any) => {
    return res.json({
        error: "404 route not found"
    });
});
router.get("*", async (req: any, res: any) => {
    return res.send({
        error: "404 Page not found"
    });
});

export default router;
