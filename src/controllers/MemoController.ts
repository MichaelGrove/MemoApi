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
        const id = req.params.id;

        const memo = await getManager().getRepository(Memo)
            .createQueryBuilder("memo")
            .leftJoinAndSelect("memo.categories", "category")
            .where("memo.mid = :mid", { mid: id })
            .getOne();

        if (!memo) {
            return res.status(404).json({ error: "Memo not found" });
        }

        return res.status(200).json({ memo });
    }

    public async create(req: Request, res: Response): Promise<any> {
        const body = req.body as IMemoRequest;

        const categories = await this.getRequestCategories(body);

        const now = new Date();
        const memoRepository = getManager().getRepository(Memo);
        const memo = await memoRepository.save({
            title: body.title,
            message: body.message,
            createdAt: now,
            updatedAt: now,
            isFavourite: Number(body.isFavourite) > 0 ? 1 : 0,
            isHidden: Number(body.isHidden) > 0 ? 1 : 0,
            categories: categories,
        });

        return res.status(200).json({ memo });
    }

    public async update(req: Request, res: Response): Promise<any> {
        const id = req.params.id;
        const body = req.body as IMemoRequest;

        const categories = await this.getRequestCategories(body);

        const now = new Date();
        const memoRepository = getManager().getRepository(Memo);
        const memo = await memoRepository.save({
            mid: Number(id),
            title: body.title,
            message: body.message,
            createdAt: now,
            updatedAt: now,
            isFavourite: Number(body.isFavourite) > 0 ? 1 : 0,
            isHidden: Number(body.isHidden) > 0 ? 1 : 0,
            categories: categories,
        });

        return res.status(200).json({ memo });
    }

    public async delete(req: Request, res: Response): Promise<any> {
        const id = req.params.id;
        const memoRepository = getManager().getRepository(Memo);
        
        return memoRepository.findOneOrFail(id)
            .then(memo => {
                memoRepository.delete(memo);
                return res.sendStatus(200);
            })
            .catch(() => {
                return res.status(404).json({ error: "Memo not found" });    
            });
    }

    private async getRequestCategories(body: IMemoRequest) {
        let categories: MemoCategory[] = [];
        const memoCategoryRepository = getManager().getRepository(MemoCategory);
        if (Array.isArray(body.categories) && body.categories.length) {
            categories = await memoCategoryRepository.findByIds(
                body.categories
                    .map(cid => Number(cid))
                    .filter((cid) => cid > 0)
            );
        }
        return categories;
    }
}

export default MemoController;
