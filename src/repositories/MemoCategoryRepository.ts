import Connection from "../database/Connection";
import MemoCategoryFactory from "../factories/MemoCategoryFactory";
import { IMemoCategory } from "../models/MemoCategory";

const table = "memo_categories";
const linkTable = "memo_category_links";

class MemoCategoryRepository {
    private conn: Connection;

    constructor(conn: Connection) {
        this.conn = conn;
    }

    public async readAll(): Promise<IMemoCategory[]> {
        const q = `SELECT * FROM ${table}`;
        const results: ICategoryQueryResult[] = await this.conn.query(q, []);

        const categoryFactory = new MemoCategoryFactory();
        return results.map((item: ICategoryQueryResult) => {
            const category = categoryFactory.makeCategory();
            category.cid = item.cid;
            category.color = item.color;
            category.label = item.label;
            return category;
        });
    }

    public async readById(id: number): Promise<IMemoCategory|null> {
        const factory = new MemoCategoryFactory();
        const q = `SELECT * FROM ${table} WHERE cid = ?`;
        const results: ICategoryQueryResult[] = await this.conn.query(q, [id]);
        if (results.length === 0) {
            return null;
        }

        const firstResult: ICategoryQueryResult = results[0];
        const category = factory.makeCategory();
        category.cid = firstResult.cid;
        category.color = firstResult.color;
        category.label = firstResult.label;
        return category;
    }

    public async create(category: IMemoCategory) {
        const q = `INSERT INTO ${table} (label, color) VALUES (?, ?)`;
        const results = await this.conn.query(q, [category.label, category.color]);

        const id = results && results.insertId ? results.InsertId : false;
        if (!id) {
            return null;
        }

        category.cid = id;
        return category;
    }

    public async update(category: IMemoCategory) {
        const q = `
            UPDATE ${table} SET
            label = ?,
            color = ?
            WHERE cid = ?
        `;

        await this.conn.query(
            q, [
               category.label,
               category.color,
               category.cid
            ]
        );

        return category;
    }

    public async delete(category: IMemoCategory) {
        await this.conn.query(`DELETE FROM ${table} WHERE mid = ?`, [category.cid]);
        await this.conn.query(`DELETE FROM ${linkTable} WHERE mid = ?`, [category.cid]);
    }

    public async readByMemoId(id: number): Promise<IMemoCategory[]> {
        const factory = new MemoCategoryFactory();
        const q = `
            SELECT ${table}.* FROM ${table}
            LEFT JOIN ${linkTable} ON ${table}.cid = ${linkTable}.cid
            WHERE ${linkTable}.mid = ?
        `;
        const results: ICategoryQueryResult[] = await this.conn.query(q, [id]);
        return results.map((item) => {
            const category = factory.makeCategory();
            category.cid = item.cid;
            category.color = item.color;
            category.label = item.label;
            return category;
        });
    }

    public async readByMemoIds(ids: number[]): Promise<IMemoCategory[]> {
        const requests = ids.map((id) => this.readById(id));
        const categories = await Promise.all(requests);
        return categories.filter((c) => c != null);
    }

    public async getCategoryLink(mid: number, cid: number) {
        const testQuery = `SELECT * FROM ${linkTable} WHERE mid = ? AND cid = ?`;
        const results = await this.conn.query(testQuery, [mid, cid]);
        return results && results.length > 0 ? results[0] : null;
    }

    public async createCategoryLink(mid: number, cid: number) {
        const link = await this.getCategoryLink(mid, cid);
        if (link === null) {
            const q = `INSERT INTO ${linkTable} (mid, cid) VALUES (?, ?)`;
            return await this.conn.query(q, [mid, cid]);
        } else {
            return Promise.resolve();
        }
    }

    public async removeCategoryLink(mid: number, cid: number) {
        const link = await this.getCategoryLink(mid, cid);
        if (link !== null) {
            const q = `DELETE FROM ${linkTable} WHERE mid = ? AND cid = ?`;
            return await this.conn.query(q, [mid, cid]);
        } else {
            return Promise.resolve();
        }
    }
}

interface ICategoryQueryResult {
    cid: number;
    label: string;
    color: string;
}

export default MemoCategoryRepository;
