import { getPostsByTrip } from "controllers/postsControllers";
import { Router } from "express";
import { authenticateToken } from "middlewares/authenticationMiddleware";

const postsRouter = Router();

postsRouter
  .all("/*", authenticateToken)
  .get("/posts/:tripId", getPostsByTrip);
//   .post("/posts/:tripId", )
//   .delete("/posts/:tripId", );

export { postsRouter };