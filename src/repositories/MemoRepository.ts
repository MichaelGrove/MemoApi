import moment from "moment";
import Connection from "../database/Connection";
import MemoCategoryFactory from "../factories/MemoCategoryFactory";
import MemoFactory from "../factories/MemoFactory";
import Memo, { IMemo } from "../models/Memo";
import MemoCategoryRepository from "./MemoCategoryRepository";

const table = "memos";
const categoryTable = "memo_categories";
const categoryLinkTable = "memo_category_links";

class MemoRepository {

    private conn: Connection;

    constructor(conn: Connection) {
        this.conn = conn;
    }

    public async readAll(): Promise<IMemo[]> {
        const q = `
            SELECT ${table}.*, ${categoryTable}.* FROM ${table}
            LEFT JOIN ${categoryLinkTable} ON ${table}.mid = ${categoryLinkTable}.mid
            LEFT JOIN ${categoryTable} ON ${categoryLinkTable}.cid = ${categoryTable}.cid
        `;

        const results = await this.conn.query(q, []);
        const memos: Map<number, Memo> = new Map();

        const memoFactory = new MemoFactory();
        const memoCategoryFactory = new MemoCategoryFactory();

        results.forEach((result: IMemoQueryResult) => {
            let memo;
            if (memos.has(result.mid)) {
                memo = memos.get(result.mid);
            } else {
                memo = memoFactory.makeMemo();
                memo.mid = result.mid;
                memo.title = result.title;
                memo.message = result.message;
                memo.createdAt = moment(result.createdAt).format("YYYY-MM-DD HH:mm:ss");
                memo.updatedAt = moment(result.updatedAt).format("YYYY-MM-DD HH:mm:ss");
                memo.isFavourite = result.isFavourite === 1 ? 1 : 0;
                memo.isHidden = result.isHidden === 1 ? 1 : 0;
                memo.categories = [];
                memos.set(result.mid, memo);
            }

            if (result.cid) {
                const category = memoCategoryFactory.makeCategory();
                category.cid = result.cid;
                category.color = result.color;
                category.label = result.label;
                memo.categories.push(category);
            }
        });

        return Array.from(memos.values());
    }

    public async readById(id: number): Promise<IMemo|null> {
        const q = `SELECT ${table}.* FROM ${table} WHERE mid = ?`;
        const results = await this.conn.query(q, [id]);
        if (results.length === 0) {
            return null;
        }

        const memoFactory = new MemoFactory();
        const memoCategoryRepository = new MemoCategoryRepository(this.conn);

        const firstResult: IMemoQueryResult = results[0];
        const memo = memoFactory.makeMemo();
        memo.mid = firstResult.mid;
        memo.title = firstResult.title;
        memo.message = firstResult.message;
        memo.createdAt = moment(firstResult.createdAt).format("YYYY-MM-DD HH:mm:ss");
        memo.updatedAt = moment(firstResult.updatedAt).format("YYYY-MM-DD HH:mm:ss");
        memo.isFavourite = firstResult.isFavourite === 1 ? 1 : 0;
        memo.isHidden = firstResult.isHidden === 1 ? 1 : 0;
        memo.categories = await memoCategoryRepository.readByMemoId(firstResult.mid);

        return memo;
    }

    public async create(memo: IMemo): Promise<IMemo|null> {
        const q = `
            INSERT INTO ${table} (title, message, createdAt, updatedAt, isFavourite, isHidden)
            VALUES (?, ?, ?, ?, ?, ?);
        `;

        const results = await this.conn.query(
            q, [
                memo.title,
                memo.message,
                memo.createdAt,
                memo.updatedAt,
                memo.isFavourite ? 1 : 0,
                memo.isHidden ? 1 : 0
            ]
        );

        const id = results && results.insertId ? results.insertId : false;
        if (!id) {
            return null;
        }

        memo.mid = id;
        return memo;
    }

    public async update(memo: IMemo): Promise<IMemo|null> {
        const q = `
            UPDATE ${table} SET
            title = ?,
            message = ?,
            updatedAt = ?,
            isFavourite = ?,
            isHidden = ?
            WHERE mid = ?
        `;

        await this.conn.query(
            q, [
                memo.title,
                memo.message,
                memo.updatedAt,
                memo.isFavourite ? 1 : 0,
                memo.isHidden ? 1 : 0,
                memo.mid
            ]
        );

        return memo;
    }

    public async delete(memo: IMemo): Promise<void> {
        await this.conn.query(`DELETE FROM ${table} WHERE mid = ?`, [memo.mid]);
        await this.conn.query(`DELETE FROM ${categoryLinkTable} WHERE mid = ?`, [memo.mid]);
    }
}

interface IMemoQueryResult {
    mid: number;
    title: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    isFavourite: number;
    isHidden: number;
    cid: number;
    label: string;
    color: string;
}

export default MemoRepository;
