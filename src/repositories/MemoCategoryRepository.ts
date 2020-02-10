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
