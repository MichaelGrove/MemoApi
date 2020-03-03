import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import ApiRouter from "./router/api";
import AuthRouter from "./router/auth";
dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

const port = process.env.NODE_PORT || 8080;

app.use("/api/auth", AuthRouter);
app.use("/api", ApiRouter);

// define a route handler for the default home page
app.get("/", async (req: any, res: any) => {
    res.send(JSON.stringify({
        routes: [
            "/api/auth/login",
            "/api/memo",
        ]
    }));
});

app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

app.use((error: any, req: any, res: any, next: any) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? "" : error.stack
    });
});

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at ${ port }`);
});
