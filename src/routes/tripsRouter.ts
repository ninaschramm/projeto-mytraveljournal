import { Router } from "express";
import { authenticateToken } from "middlewares/authenticationMiddleware";
import { getTripsByUsers } from "controllers/tripsControllers";

const tripsRouter = Router();

tripsRouter
  .all("/*", authenticateToken)
  .get("/", getTripsByUsers)
//   .post("/", )
//   .delete("/:bookingId", );


export { tripsRouter };