import { addNewReservation, getReservationsByTrip, removeReservation } from "controllers/reservationsControllers";
import { Router } from "express";
import { authenticateToken } from "middlewares/authenticationMiddleware";

const reservationsRouter = Router();

reservationsRouter
  .all("/*", authenticateToken)
  .get("/reservations/:tripId", getReservationsByTrip)
  .post("/reservations/:tripId", addNewReservation)
  .delete("/reservations/:tripId/:reservationId", removeReservation);

export { reservationsRouter };