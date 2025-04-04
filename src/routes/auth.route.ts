import { Router } from "express";
import { userLogin, userLogout, userMe, userSignup } from "../controllers/auth.controller";
import verifyJwtToken from "../middlewares/verifyJwtToken";
const authRouter = Router();

authRouter.post("/signup", userSignup);
authRouter.post("/login", userLogin);
authRouter.get("/me", verifyJwtToken, userMe);
authRouter.get("/logout", verifyJwtToken, userLogout);

export default authRouter;