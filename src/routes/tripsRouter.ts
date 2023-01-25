import { Router } from "express";
import { authenticateToken } from "middlewares/authenticationMiddleware";
import { getTripsByUsers, addNewTrip, removeTrip } from "controllers/tripsControllers";

const tripsRouter = Router();

tripsRouter
  .all("/*", authenticateToken)
  .get("/", getTripsByUsers)
  .post("/", addNewTrip)
  .delete("/:tripId", removeTrip);


export { tripsRouter };