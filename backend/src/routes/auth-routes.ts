import { Router } from 'express';
import { loginHandler, logoutHandler, refreshHandler, registerHandler } from '../controllers/auth/authentication-controller';


const authRouter = Router();
authRouter.post("/registration", registerHandler)
authRouter.post("/login", loginHandler)
authRouter.get("/refresh", refreshHandler);
authRouter.get("/logout", logoutHandler);


export default authRouter;