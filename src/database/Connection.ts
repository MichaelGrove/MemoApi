import mysql, { ConnectionConfig } from "mysql";
import config from "../../config.json";

class Connection {
    private conn: mysql.Connection;
    private database: string;
    private host: string;
    private password: string;
    private port: number;
    private user: string;

    constructor() {
        this.loadConfig();

        this.conn = mysql.createConnection({
            database: this.database,
            host: this.host,
            password: this.password,
            port: this.port,
            user: this.user,
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

    private loadConfig(): void {
        this.host = String(config.database.host);
        this.port = Number(config.database.port);
        this.user = String(config.database.user);
        this.password = String(config.database.password);
        this.database = String(config.database.database);
    }
}

export default Connection;
