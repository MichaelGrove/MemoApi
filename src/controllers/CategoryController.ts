import Connection from "../database/Connection";
import MemoCategoryFactory from "../factories/MemoCategoryFactory";
import MemoCategoryRepository from "../repositories/MemoCategoryRepository";

class CategoryController {

    private conn: Connection;

    constructor() {
        this.conn = new Connection();
    }

    public async index(req: any, res: any) {
        const repository = new MemoCategoryRepository(this.conn);
        const results = await repository.readAll();
        return res.json({ data: results });
    }

    public async edit(req: any, res: any) {
        const repository = new MemoCategoryRepository(this.conn);
        const id = req.params && req.params.id ? req.params.id : false;
        if (!id) {
            return res.json({ error: "Missing ID" });
        }

        const category = await repository.readById(id);
        if (category === null) {
            return res.json({ error: "Category not found" });
        }

        return res.json({ data: category });
    }

    public async create(req: any, res: any) {
        const repository = new MemoCategoryRepository(this.conn);
        const factory = new MemoCategoryFactory();
        const category = factory.makeCategory();

        let body: ICategoryRequest = null;
        if (Object.keys(req.body).length > 0) {
            body = req.body as ICategoryRequest;
        } else if (Object.keys(req.query).length > 0) {
            body = req.query as ICategoryRequest;
        } else {
            return res.json({ error: "Unexpected error" });
        }

        category.label = String(body.label);
        category.color = String(body.color);

        if (category.label.length === 0) {
            return res.json({ error: "Invalid label value length" });
        }

        if (category.color.length === 0) {
            return res.json({ error: "Invalid color value length "});
        }

        const newCategory = repository.create(category);
        if (newCategory == null) {
            return res.json({ error: "Unexpected error" });
        }

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

        const repo = new MemoCategoryRepository(this.conn);
        const category = await repo.readById(id);
        if (category == null) {
            return res.json({ error: "Category not found" });
        }

        category.label = label;
        category.color = color;

        const updatedCategory = await repo.update(category);

        return res.json({ success: 1, data: updatedCategory });
    }

    public async delete(req: any, res: any) {
        const id = req.params && req.params.id ? req.params.id : false;
        if (!id) {
            return res.json({ error: "Missing ID" });
        }

        const repo = new MemoCategoryRepository(this.conn);
        const category = await repo.readById(id);
        if (!category) {
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
