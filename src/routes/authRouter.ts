import { Router } from "express";

import { createUserSchema, userSchema } from "../schemas/authSchemas";

import { createUser, loginUser } from "../controllers/authControllers";

import { validateSchema } from "../middlewares/ValidateSchema";

const authRouter = Router();

authRouter.post("/signup", validateSchema(createUserSchema), createUser);
authRouter.post("/signin", validateSchema(userSchema), loginUser);

export default authRouter;