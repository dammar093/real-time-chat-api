import { Router } from "express";
import verifyJwtToken from "../middlewares/verifyJwtToken";
import { getMessage, insertMessage } from "../controllers/message.controller";

const messageRouter = Router();

messageRouter.post("/:id", verifyJwtToken, insertMessage);
messageRouter.get("/:id", verifyJwtToken, getMessage);

export default messageRouter;