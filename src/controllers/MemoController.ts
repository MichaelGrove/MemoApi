import moment from "moment";
import Connection from "../database/Connection";
import MemoFactory from "../factories/MemoFactory";
import MemoCategoryRepository from "../repositories/MemoCategoryRepository";
import MemoRepository from "../repositories/MemoRepository";

class MemoController {
    private conn: Connection;
    constructor() {
        this.conn = new Connection();
    }

    public async index(req: any, res: any): Promise<any> {
        const repository = new MemoRepository(this.conn);
        const results = await repository.readAll();
        return res.json({ data: results });
    }

    public async edit(req: any, res: any): Promise<any> {
        const repository = new MemoRepository(this.conn);
        const id = req.params && req.params.id ? req.params.id : false;
        if (!id) {
            return res.json({ error: "Missing ID" });
        }

        const memo = await repository.readById(id);
        if (!memo) {
            return res.json({ error: "Memo not found" });
        }

        return res.json({ data: memo });
    }

    public async create(req: any, res: any): Promise<any> {
        const factory = new MemoFactory();
        let memo = factory.makeMemo();

        const memoRepository = new MemoRepository(this.conn);
        const memoCategoryRepository = new MemoCategoryRepository(this.conn);

        const now = moment().format("YYYY-MM-DD HH:mm:ss");

        let body: IMemoRequest = null;
        if (Object.keys(req.body).length > 0) {
            body = req.body as IMemoRequest;
        } else if (Object.keys(req.query).length > 0) {
            body = req.query as IMemoRequest;
        } else {
            return res.json({ error: "Unexpected error" });
        }

        memo.title = String(body.title);
        memo.message = String(body.message);
        memo.createdAt = now;
        memo.updatedAt = now;
        memo.isFavourite = body.isFavourite === "1" ? 1 : 0;
        memo.isHidden = body.isHidden === "1" ? 1 : 0;

        if (memo.title.length === 0) {
            return res.json({ error: "Invalid title value length" });
        }

        memo = await memoRepository.create(memo);

        if (Array.isArray(body.categories)) {
            const categoryIds = body.categories.map((cid) => Number(cid)).filter((cid) => cid > 0);
            const categoryLinkPool = categoryIds.map((cid) =>
                memoCategoryRepository.createCategoryLink(memo.mid, cid)
            );

            await Promise.all(categoryLinkPool);
        }

        const newMemo = await memoRepository.readById(memo.mid);

        return res.json({ success: 1, data: newMemo });
    }

    public async update(req: any, res: any): Promise<any> {
        const id = req.params && req.params.id ? req.params.id : false;

        const memoRepository = new MemoRepository(this.conn);
        const memoCategoryRepository = new MemoCategoryRepository(this.conn);

        let memo = await memoRepository.readById(id);

        let body: IMemoRequest = null;
        if (Object.keys(req.body).length > 0) {
            body = req.body as IMemoRequest;
        } else if (Object.keys(req.query).length > 0) {
            body = req.query as IMemoRequest;
        } else {
            return res.json({ error: "Unexpected error" });
        }

        memo.title = String(body.title);
        memo.message = String(body.message);
        memo.updatedAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const isFavourite = Number(body.isFavourite);
        memo.isFavourite = isFavourite > 0 ? 1 : 0;
        const isHidden = Number(body.isHidden);
        memo.isHidden = isHidden > 0 ? 1 : 0;

        if (memo.title.length === 0) {
            return res.json({ error: "Invalid title value length" });
        }

        memo = await memoRepository.update(memo);

        let updatedCids: number[] = [];
        if (Array.isArray(body.categories)) {
            updatedCids = body.categories.map((cid) => Number(cid)).filter((cid) => cid > 0);
        }

        const oldCids = memo.categories.map((cat) => Number(cat.cid)).filter((cid) => cid > 0);

        const cidsToDelete: number[] = [];
        const cidsToCreate: number[] = [];

        for (const cid of updatedCids) {
            if (oldCids.indexOf(cid) === -1) {
                cidsToCreate.push(cid);
            }
        }

        for (const cid of oldCids) {
            if (updatedCids.indexOf(cid) === -1) {
                cidsToDelete.push(cid);
            }
        }

        const queryPool: Array<Promise<any>> = [];
        cidsToCreate.forEach((cid) => {
            queryPool.push(memoCategoryRepository.createCategoryLink(memo.mid, cid));
        });

        cidsToDelete.forEach((cid) => {
            queryPool.push(memoCategoryRepository.removeCategoryLink(memo.mid, cid));
        });

        await Promise.all(queryPool);

        const updatedMemo = await memoRepository.readById(memo.mid);
        return res.json({ success: 1, data: updatedMemo });
    }

    public async delete(req: any, res: any): Promise<any> {
        const id = req.params && req.params.id ? req.params.id : false;
        if (!id) {
            return res.json({ error: "Missing ID" });
        }

        const repository = new MemoRepository(this.conn);

        const memo = await repository.readById(id);
        if (!memo) {
            return res.json({ error: "Memo not found" });
        }

        await repository.delete(memo);
        return res.json({ success: 1 });
    }
}

interface IMemoRequest {
    mid: string;
    title: string;
    message: string;
    isFavourite: string;
    isHidden: string;
    categories: string[];
}

export default MemoController;
