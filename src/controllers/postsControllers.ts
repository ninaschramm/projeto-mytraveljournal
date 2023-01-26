import postsServices from "services/postsServices";
import { AuthenticatedRequest } from "middlewares/authenticationMiddleware";
import { Response, NextFunction } from "express";
import { errorHandlerMiddleware } from "middlewares/errorHandlerMiddleware";

export async function getPostsByTrip(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const tripId = req.params.tripId;

    try {
        const posts = await postsServices.getPostsByTrip(userId, Number(tripId));
        return res.status(200).send(posts)
    }
    catch(err) {
        errorHandlerMiddleware(err, req, res, next);
    }
}

export async function addNewPost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const tripId = req.params.tripId;
    const { image, text } = req.body;

    try {
        const post = await postsServices.addNewPost(userId, Number(tripId), image, text);
        return res.status(200).send(post)
    }
    catch(err) {
        errorHandlerMiddleware(err, req, res, next);
    }
}

export async function removePost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { userId } = req;
    const tripId = req.params.tripId;
    const { postId } = req.body;

    try {
        await postsServices.removePost(userId, Number(tripId), postId);
        return res.status(204).send("Post deleted");
    }
    catch(err) {
        errorHandlerMiddleware(err, req, res, next);
    }
}