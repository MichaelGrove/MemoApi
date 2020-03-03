import mysql, { ConnectionConfig } from "mysql";
import requiredForSomeReason from "../../config.json";
import config from "../config";

const database: string = config.database.database;
const host: string = config.database.host;
const password: string = config.database.password;
const port: number = Number(config.database.port);
const user: string = config.database.user;

class Connection {
    private conn: mysql.Connection;

    constructor() {
        this.conn = mysql.createConnection({
            database,
            host,
            password,
            port,
            user,
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
