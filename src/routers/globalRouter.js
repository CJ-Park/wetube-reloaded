import express from "express";
import {join} from "../controllers/userController";
import {recommend} from "../controllers/videoController";


const globalRouter = express.Router();

globalRouter.get("/", recommend);
globalRouter.get("/join", join);

export default globalRouter;