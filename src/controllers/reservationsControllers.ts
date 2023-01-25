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

export async function addNewReservation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const tripId = req.params.tripId;
    const { title, code, type } = req.body;

    try {
        const reservation = await reservationsServices.addNewReservation(userId, Number(tripId), code, type, title);
        return res.status(200).send(reservation)
    }
    catch(err) {
        errorHandlerMiddleware(err, req, res, next);
    }
}

export async function removeReservation(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const tripId = req.params.tripId;
    const { reservationId } = req.body;

    try {
        await reservationsServices.removeReservation(userId, Number(tripId), reservationId);
        return res.status(204).send("Reservation deleted");
    }
    catch(err) {
        errorHandlerMiddleware(err, req, res, next);
    }
}