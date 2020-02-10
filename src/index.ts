import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import ApiRouter from "./router/api";
import AuthRouter from "./router/auth";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan("combined"));

const port = 8080;

app.use("/api/auth", AuthRouter);
app.use("/api/memo", ApiRouter);

// define a route handler for the default home page
app.get("/", async (req: any, res: any) => {
    res.send(JSON.stringify({
        routes: [
            "/api/auth/login",
            "/api/memo",
        ]
    }));
});

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at ${ port }`);
});
