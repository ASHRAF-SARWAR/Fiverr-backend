import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRouters.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

dotenv.config();
connectDB();

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
