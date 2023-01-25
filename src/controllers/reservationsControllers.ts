import reservationsServices from "services/reservationsServices";
import { AuthenticatedRequest } from "middlewares/authenticationMiddleware";
import { Response, NextFunction } from "express";
import { errorHandlerMiddleware } from "middlewares/errorHandlerMiddleware";

export async function getReservationsByTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const tripId = req.params.tripId;

    try {
        const reservations = await reservationsServices.getReservationsByTrip(userId, Number(tripId));
        return res.status(200).send(reservations)
    }
    catch(err) {
        errorHandlerMiddleware(err, req, res, next);
    }
}