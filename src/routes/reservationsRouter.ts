import { Router } from "express";
import { authenticateToken } from "middlewares/authenticationMiddleware";

const reservationsRouter = Router();

function getList() {
    return ("Hello, world")
}

reservationsRouter
  .all("/*", authenticateToken)
  .get("/:tripId/reservations", getList)
//   .post("/", addNewTrip)
//   .delete("/:tripId", removeTrip);

export { reservationsRouter };