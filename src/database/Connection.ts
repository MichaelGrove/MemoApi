import mysql, { ConnectionConfig } from "mysql";
import cfg from "../config";

class Connection {
    private conn: mysql.Connection;

    constructor() {
        this.conn = mysql.createConnection({
            database: String(cfg.database.database),
            host: String(cfg.database.host),
            password: String(cfg.database.password),
            port: Number(cfg.database.port),
            user: String(cfg.database.database),
        } as ConnectionConfig);
    }

    public async query(q: string, params: Array<string|number>): Promise<any> {
        return new Promise((resolve, reject) => {
            this.conn.query(q, params, (err, results) => {
                if (err) {
                    return reject(err);
                }

                return resolve(results);
            });
        });
    }
}

export default Connection;
