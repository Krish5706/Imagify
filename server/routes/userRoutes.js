import express from "express";
import {registerUser,loginUser, userCredits} from "../controllers/userControllers.js";
import userAuth from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/credits",userAuth,userCredits);

export default userRouter;

//http://localhost:5173//api/user/register
//http://localhost:5173//api/user/login