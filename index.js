import express from "express";
import dotenv from "@dotenvx/dotenvx";
import cors from "cors";
import { connectDB } from "./config/db.js";
import mainRouter from "./routers/main.router.js";
dotenv.config();

const app = express();

app.use(cors({ origin: [process.env.FRONTEND_URL], credentials: true }));
app.use(express.json());

connectDB();

app.use("/api/v1", mainRouter);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
