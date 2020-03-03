import dotenv from "dotenv";
dotenv.config();

export default {
    title: process.env.APP_TITLE,
    secret: process.env.APP_SECRET,
    mode: process.env.NODE_ENV,
    port: process.env.NODE_PORT,
    jwt: {
        issuer: process.env.JWT_ISSUER,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
    database: {
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
    }
};
