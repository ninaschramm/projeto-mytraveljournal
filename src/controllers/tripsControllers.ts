import tripsServices from "services/tripsServices";
import { AuthenticatedRequest } from "middlewares/authenticationMiddleware";
import { Response, NextFunction } from "express";
import { errorHandlerMiddleware } from "middlewares/errorHandlerMiddleware";

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

export async function addNewTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const { title, startDate, endDate } = req.body;

    try {
        await tripsServices.addNewTrip(userId, title, startDate, endDate)
        return res.status(201).send("New trip added");
    }
    catch(err) {
        errorHandlerMiddleware(err, req, res, next);
    }
}

export async function removeTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const tripId = req.params.tripId;

    try {
        await tripsServices.removeTrip(userId, Number(tripId));
        return res.status(204).send("Trip deleted")
    }
    catch(err) {
        errorHandlerMiddleware(err, req, res, next);
    }
}

export async function getTripInfo(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const tripId = req.params.tripId;

    try {
        const trip = await tripsServices.getTripInfo(userId, Number(tripId));
        return res.status(200).send(trip)
    }
    catch(err) {
        errorHandlerMiddleware(err, req, res, next);
    }
}