import express from "express";
import {getEdit, postEdit, logout, startGithubLogin, finishGithubLogin, see, getEditPassword, postEditPassword} from "../controllers/userController";
import {avatarUpload, protectMiddleware, publicOnlyMiddleware} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", protectMiddleware, logout);
userRouter.route("/edit").all(protectMiddleware)
.get(getEdit).post(avatarUpload.single("avatar"), postEdit);
userRouter.route("/edit-password").all(protectMiddleware)
.get(getEditPassword).post(postEditPassword);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get(":id", see);

export default userRouter;