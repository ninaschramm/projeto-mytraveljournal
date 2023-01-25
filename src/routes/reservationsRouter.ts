import { getReservationsByTrip } from "controllers/reservationsControllers";
import { Router } from "express";
import { authenticateToken } from "middlewares/authenticationMiddleware";

const reservationsRouter = Router();

reservationsRouter
  .all("/*", authenticateToken)
  .get("/reservations/:tripId", getReservationsByTrip)
//   .post("/", addNewTrip)
//   .delete("/:tripId", removeTrip);

export { reservationsRouter };