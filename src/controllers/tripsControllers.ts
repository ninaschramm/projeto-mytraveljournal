import tripsServices from "services/tripsServices";
import { AuthenticatedRequest } from "middlewares/authenticationMiddleware";
import { Response } from "express";

export async function getTripsByUsers(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    try {
        const result = await tripsServices.getTripsByUser(userId)
        return res.status(200).send(result);
    }
    catch (err) {
        return res.sendStatus(400);
    }
}