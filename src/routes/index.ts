import { Router } from "express";
import { authRouter } from "./authRouter";
import { postsRouter } from "./postsRouter";
import { reservationsRouter } from "./reservationsRouter";
import { tripsRouter } from "./tripsRouter";

const router = Router();

router
.use(authRouter)
.use(tripsRouter)
.use(reservationsRouter)
.use(postsRouter)

 export { router };