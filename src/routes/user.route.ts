import { Router } from "express";
import verifyJwtToken from "../middlewares/verifyJwtToken";
import { getAllUsers } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", verifyJwtToken, getAllUsers);


export default userRouter;