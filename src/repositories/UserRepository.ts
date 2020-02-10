import moment from "moment";
import Connection from "../database/Connection";
import UserFactory from "../factories/UserFactory";
import { IUser, User } from "../models/User";

const table = "users";

class UserRepository {

    private conn: Connection;
    private userFactory: UserFactory;

    constructor(conn: Connection) {
        this.conn = conn;
        this.userFactory = new UserFactory();
    }

    public async getUserByEmail(email: string): Promise<IUser> {
        const results: IUserQueryResult[] = await this.conn.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
        const data: IUserQueryResult = results && results.length > 0 ? results[0] : null;
        if (data === null) {
            return null;
        }

        const user: User = this.userFactory.makeUser();
        user.uid = data.uid;
        user.displayName = data.displayName;
        user.email = data.email;
        user.password = data.password;
        user.createdAt = moment(data.createdAt).format("YYYY-MM-DD HH:mm:ss");
        user.updatedAt = moment(data.updatedAt).format("YYYY-MM-DD HH:mm:ss");
        return user;
    }

    public async createUser(user: IUser): Promise<IUser> {
        const now = moment().format("YYYY-MM-DD HH:mm:ss");
        const results = await this.conn.query(`
            INSERT INTO ${table} (displayName, email, password, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)
        `, [user.displayName, user.email, user.password, now, now]);

        const id = results && results.insertId ? results.insertId : false;
        if (!id) {
            return null;
        }

        user.uid = id;
        return user;
    }
}

interface IUserQueryResult {
    uid: number;
    displayName: string;
    email: string;
    password: string;
    createdAt: string;
    updatedAt: string;
}

export default UserRepository;
