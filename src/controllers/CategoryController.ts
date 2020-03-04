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
        const id = req.params && req.params.id ? req.params.id : false;
        if (!id) {
            return res.json({ error: "Missing ID" });
        }

        const repo = getManager().getRepository(MemoCategory);
        const category = await repo.findOne(id);
        if (category === null) {
            return res.json({ error: "Category not found" });
        }

        return res.json({ data: category });
    }

    public async create(req: Request, res: Response) {
        let body: ICategoryRequest = null;

        // Replace with validator
        if (Object.keys(req.body).length > 0) {
            body = req.body as ICategoryRequest;
        } else if (Object.keys(req.query).length > 0) {
            body = req.query as ICategoryRequest;
        } else {
            return res.json({ error: "Unexpected error" });
        }

        const category = new MemoCategory();
        category.label = String(body.label);
        category.color = String(body.color);

        if (category.label.length === 0) {
            return res.json({ error: "Invalid label value length" });
        }

        if (category.color.length === 0) {
            return res.json({ error: "Invalid color value length "});
        }

        const repo = getManager().getRepository(MemoCategory);
        const newCategory = await repo.save(category);

        return res.json({ success: 1, data: newCategory });
    }

    public async update(req: any, res: any) {
        const id = req.params && req.params.id ? req.params.id : false;
        if (!id) {
            return res.json({ error: "Missing ID" });
        }

        let body: ICategoryRequest = null;
        if (Object.keys(req.body).length > 0) {
            body = req.body as ICategoryRequest;
        } else if (Object.keys(req.query).length > 0) {
            body = req.query as ICategoryRequest;
        } else {
            return res.json({ error: "Unexpected error" });
        }

        const label = String(body.label);
        const color = String(body.color);

        if (label.length === 0) {
            return res.json({ error: "Invalid label value length" });
        }

        if (color.length === 0) {
            return res.json({ error: "Invalid color value length "});
        }

        const repo = getManager().getRepository(MemoCategory);
        const category = await repo.findOne(id);
        if (category === null) {
            return res.json({ error: "Category not found" });
        }

        category.label = label;
        category.color = color;

        const updatedCategory = await repo.save(category);

        return res.json({ success: 1, data: updatedCategory });
    }

    public async delete(req: any, res: any) {
        const id = req.params && req.params.id ? req.params.id : false;
        if (!id) {
            return res.json({ error: "Missing ID" });
        }

        const repo = getManager().getRepository(MemoCategory);
        const category = await repo.findOne(id);
        if (category === null) {
            return res.json({ error: "Category not found" });
        }

        await repo.delete(category);
        return res.json({ success: 1 });
    }
}

interface ICategoryRequest {
    cid: string;
    label: string;
    color: string;
}

export default CategoryController;
