import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Memo } from "../entity/Memo";
import { MemoCategory } from "../entity/MemoCategory";
// import moment from "moment";

class MemoController {

    public async index(req: any, res: Response): Promise<any> {
        const memoRepository = getManager().getRepository(Memo);

        let results: Memo[] = [];
        if (req.isAuthorized) {
            results = await memoRepository
                .createQueryBuilder("memo")
                .leftJoinAndSelect("memo.categories", "category")
                .getMany();
        } else {
            results = await memoRepository
                .createQueryBuilder("memo")
                .leftJoinAndSelect("memo.categories", "category")
                .where("memo.isHidden = :isHidden", { isHidden: 0 })
                .getMany();
        }

        // tslint:disable-next-line: no-console
        console.log(results[135]);

        return res.json({ data: results });
    }

    public async edit(req: Request, res: Response): Promise<any> {
        const id = req.params && req.params.id ? req.params.id : false;
        if (!id) {
            return res.json({ error: "Missing ID" });
        }

        const memo = await getManager().getRepository(Memo)
            .createQueryBuilder("memo")
            .leftJoinAndSelect("memo.categories", "category")
            .where("memo.mid = :mid", { mid: id })
            .getOne();


        if (!memo) {
            return res.json({ error: "Memo not found" });
        }

        return res.json({ data: memo });
    }

    public async create(req: Request, res: Response): Promise<any> {
        // Replace with validator
        let body: IMemoRequest = null;
        if (Object.keys(req.body).length > 0) {
            body = req.body as IMemoRequest;
        } else if (Object.keys(req.query).length > 0) {
            body = req.query as IMemoRequest;
        } else {
            return res.json({ error: "Unexpected error" });
        }

        let categories: MemoCategory[] = [];
        const memoCategoryRepository = getManager().getRepository(MemoCategory);
        if (Array.isArray(body.categories) && body.categories.length > 0) {
            categories = await memoCategoryRepository.findByIds(body.categories.map((cid) => Number(cid)));
        }

        const memo = new Memo();
        memo.title = String(body.title);
        memo.message = String(body.message);
        memo.createdAt = new Date();
        memo.updatedAt = new Date();
        const isFavourite = Number(body.isFavourite);
        memo.isFavourite = isFavourite > 0 ? 1 : 0;
        const isHidden = Number(body.isHidden);
        memo.isHidden = isHidden > 0 ? 1 : 0;
        memo.categories = categories;

        if (memo.title.length === 0) {
            return res.json({ error: "Invalid title value length" });
        }

        const memoRepository = getManager().getRepository(Memo);
        const newMemo = await memoRepository.save(memo);

        return res.json({ success: 1, data: newMemo });
    }

    public async update(req: Request, res: Response): Promise<any> {
        const id = req.params && req.params.id ? req.params.id : false;
        if (!id) {
            return res.json({ error: "Missing ID" });
        }

        // replace with validator
        let body: IMemoRequest = null;
        if (Object.keys(req.body).length > 0) {
            body = req.body as IMemoRequest;
        } else if (Object.keys(req.query).length > 0) {
            body = req.query as IMemoRequest;
        } else {
            return res.json({ error: "Unexpected error" });
        }

        let categories: MemoCategory[] = [];
        const memoCategoryRepository = getManager().getRepository(MemoCategory);
        if (Array.isArray(body.categories) && body.categories.length > 0) {
            const cids = body.categories.map((cid) => Number(cid)).filter((cid) => cid > 0);
            categories = await memoCategoryRepository.findByIds(cids);
        }

        const memoRepository = getManager().getRepository(Memo);
        const memo = await memoRepository.findOne(id);
        memo.title = String(body.title);
        memo.message = String(body.message);
        memo.updatedAt = new Date();
        const isFavourite = Number(body.isFavourite);
        memo.isFavourite = isFavourite > 0 ? 1 : 0;
        const isHidden = Number(body.isHidden);
        memo.isHidden = isHidden > 0 ? 1 : 0;
        memo.categories = categories;

        if (!memo.title) {
            return res.json({ error: "Invalid title value length" });
        }

        const updatedMemo = await memoRepository.save(memo);

        return res.json({ success: 1, data: updatedMemo });
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const id = req.params && req.params.id ? req.params.id : false;
        if (!id) {
            return res.json({ error: "Missing ID" });
        }

        const memoRepository = getManager().getRepository(Memo);
        const memo = await memoRepository.findOne(id);

        if (!memo) {
            return res.json({ error: "Memo not found" });
        }

        await memoRepository.delete(memo);
        return res.json({ success: 1 });
    }
}

interface IMemoRequest {
    mid: string;
    title: string;
    message: string;
    isFavourite: number;
    isHidden: number;
    categories: string[];
}

export default MemoController;
