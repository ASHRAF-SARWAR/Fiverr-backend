import express from "express";
import { getUsers, signin, signup } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/", getUsers);

export default userRouter;
