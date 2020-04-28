import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Memo } from "../entity/Memo";
import { MemoCategory } from "../entity/MemoCategory";

interface IMemoRequest {
    mid: string;
    title: string;
    message: string;
    isFavourite: number;
    isHidden: number;
    categories: number[];
}

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

        return res.status(200).json({ data: results });
    }

    public async edit(req: Request, res: Response): Promise<any> {
        const id = req.params && req.params.id ? req.params.id : false;
        if (!id) {
            return res.status(404).json({ error: "Missing ID" });
        }

        const memo = await getManager().getRepository(Memo)
            .createQueryBuilder("memo")
            .leftJoinAndSelect("memo.categories", "category")
            .where("memo.mid = :mid", { mid: id })
            .getOne();

        if (!memo) {
            return res.status(404).json({ error: "Memo not found" });
        }

        return res.status(200).json({ data: memo });
    }

    public async create(req: Request, res: Response): Promise<any> {
        const body = req.body as IMemoRequest;

        let categories: MemoCategory[] = [];
        const memoCategoryRepository = getManager().getRepository(MemoCategory);
        if (Array.isArray(body.categories) && body.categories.length > 0) {
            categories = await memoCategoryRepository.findByIds(body.categories.map((cid) => cid));
        }

        const memo = new Memo();
        memo.title = body.title;
        memo.message = body.message;
        memo.createdAt = new Date();
        memo.updatedAt = new Date();
        memo.isFavourite = Number(body.isFavourite) > 0 ? 1 : 0;
        memo.isHidden = Number(body.isHidden) > 0 ? 1 : 0;
        memo.categories = categories;

        const memoRepository = getManager().getRepository(Memo);
        const newMemo = await memoRepository.save(memo);

        return res.status(200).json({ success: 1, data: newMemo });
    }

    public async update(req: Request, res: Response): Promise<any> {
        const id = req.params && req.params.id ? req.params.id : false;
        if (!id) {
            return res.status(404).json({ error: "Missing ID" });
        }

        const body = req.body as IMemoRequest;

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
        memo.isFavourite = Number(body.isFavourite) > 0 ? 1 : 0;
        memo.isHidden = Number(body.isHidden) > 0 ? 1 : 0;
        memo.categories = categories;

        const updatedMemo = await memoRepository.save(memo);

        return res.status(200).json({ success: 1, data: updatedMemo });
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const id = req.params && req.params.id ? req.params.id : false;
        if (!id) {
            return res.status(404).json({ error: "Missing ID" });
        }

        const memoRepository = getManager().getRepository(Memo);
        const memo = await memoRepository.findOne(id);

        if (!memo) {
            return res.status(404).json({ error: "Memo not found" });
        }

        await memoRepository.delete(memo);
        return res.status(200).json({ success: 1 });
    }
}

export default MemoController;
