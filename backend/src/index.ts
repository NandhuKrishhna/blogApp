import "dotenv/config";
import cors from "cors";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import { APP_ORIGIN, PORT } from "./constants/env";
import errorHandler from "./middleware/errorHandler";
import authRouter from "./routes/auth-routes";
import authenticate from "./middleware/authMiddleware";
import articleRoutes from "./routes/article-routes";



const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"];
const CORS_ALLOWED_HEADERS = ["Content-Type", "Authorization"];

const corsOptions = {
    origin: APP_ORIGIN,
    credentials: true,
    methods: CORS_METHODS,
    allowedHeaders: CORS_ALLOWED_HEADERS,
}
app.use(cors(corsOptions));
app.get("/", (req, res) => {
    res.send("Welcome to the Blogs api");
});

app.use("/api", authRouter);
app.use("/api", authenticate, articleRoutes)



app.use(errorHandler);
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
})