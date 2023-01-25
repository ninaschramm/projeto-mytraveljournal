import { Router } from "express";
import { authRouter } from "./authRouter";
import { tripsRouter } from "./tripsRouter";

const router = Router();

router
.use(authRouter)
.use(tripsRouter)

 export { router };