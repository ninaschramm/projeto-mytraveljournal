import * as authServices from "../services/authServices";
import { Request, Response } from "express";
import { userData } from "../types/userTypes";

export async function createUser(req: Request, res: Response){
    const { email, username, password } = req.body;
    const user: userData = {
        email,
        username,
        password
    }
    await authServices.createUser(user);
    return res.sendStatus(201);    
}

export async function loginUser(req: Request, res: Response) {
    const { username, password } = req.body;
    const user: userData = {
        username,
        password
    }
    const token = await authServices.login(user);
    return res.status(200).send(token)
}