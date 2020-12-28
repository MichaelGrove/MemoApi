import { Request, Response } from "express";
import { getManager } from "typeorm";
import { MemoCategory } from "../entity/MemoCategory";

class CategoryController {

    public async index(req: Request, res: Response) {
        const repo = getManager().getRepository(MemoCategory);
        const results = await repo.find();
        return res.json({ data: results });
    }

    public async edit(req: Request, res: Response) {
        const id = req.params.id;
        const repo = getManager().getRepository(MemoCategory);
        const category = await repo.findOne(id);
        if (category === null) {
            return res.status(404).json({ error: "Category not found" });
        }

        return res.json({ data: category });
    }

    public async create(req: Request, res: Response) {
        const body = req.body as ICategoryRequest;
        const label = String(body.label);

        // TODO: Replace with validator
        if (label.length === 0) {
            return res.status(422).json({
                errors: [
                    {
                        value: label,
                        msg: "Invalid label value length",
                        param: "label",
                        location: "body"
                    }
                ]
            });
        }

        const repo = getManager().getRepository(MemoCategory);
        const category = await repo.save({ label });

        return res.status(200).json({ category });
    }

    public async update(req: any, res: any) {
        const id = req.params.id;
        const body = req.body as ICategoryRequest;
        const label = String(body.label);

        // TODO: Replace with validator
        if (label.length === 0) {
            return res.status(422).json({
                errors: [
                    {
                        value: label,
                        msg: "Invalid label value length",
                        param: "label",
                        location: "body"
                    }
                ]
            });
        }

        const repo = getManager().getRepository(MemoCategory);
        const category = repo.save({
            cid: id,
            label
        });

        return res.status(200).json({ category });
    }

    public async delete(req: any, res: any) {
        const id = req.params && req.params.id ? req.params.id : false;
        if (!id) {
            return res.status(404).json({ error: "Missing ID" });
        }

        const repo = getManager().getRepository(MemoCategory);
        const category = await repo.findOne(id);
        if (category === null) {
            return res.status(404).json({ error: "Category not found" });
        }

        await repo.delete(category);
        return res.sendStatus(200);
    }
}

interface ICategoryRequest {
    cid: string;
    label: string;
}

export default CategoryController;
