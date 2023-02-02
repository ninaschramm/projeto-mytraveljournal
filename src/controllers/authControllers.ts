import * as authServices from "../services/authServices";
import { NextFunction, Request, Response } from "express";
import { userData } from "../types/userTypes";
import { Prisma } from "@prisma/client";
import { errorHandlerMiddleware } from '../middlewares/errorHandlerMiddleware';

export async function createUser(req: Request, res: Response, next: NextFunction){
    const { email, username, password } = req.body;
    const user: Prisma.UserUncheckedCreateInput = {
        email,
        username,
        password
    }
    try {
        await authServices.createUser(user);
        return res.sendStatus(201);    
    }
    catch(err) {
        errorHandlerMiddleware(err, req, res, next);
    }
    
}

export async function loginUser(req: Request, res: Response, next: NextFunction) {
    const { username, password } = req.body;
    const user: userData = {
        username,
        password
    }
    try {
        const token = await authServices.login(user);
        return res.status(200).send(token)
    }
    catch(err) {
        errorHandlerMiddleware(err, req, res, next);
    }    
}