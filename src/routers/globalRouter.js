import express from "express";
import {join, login} from "../controllers/userController";
import {recommend, search} from "../controllers/videoController";


const globalRouter = express.Router();

globalRouter.get("/", recommend);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter;