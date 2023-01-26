import postsRepository from "repositories/postsRepository";
import { verifyPermission } from "middlewares/verifyPermissionMiddleware";
import { verifySchema } from "middlewares/validateSchemasMiddleware";

async function getPostsByTrip(userId: number, tripId: number) {

    await verifyPermission(userId, tripId);

    const result = await postsRepository.getPostsByTrip(tripId);
    return result;
}

async function addNewPost(userId: number, tripId: number, image: string, text: string) {

    verifySchema(image, text);
    await verifyPermission(userId, tripId);

    const data = {
        tripId,
        image,
        text
    }

    const post = await postsRepository.addNewPost(data);
    return post;
}

// async function removePost(userId: number, tripId: number, postId: number) {

//     await verifyPermission(userId, tripId);

//     const post = await postsRepository.removePost(postId);
//     return post;
// }

const postsServices = {
    getPostsByTrip,
    addNewPost,
    // removePost,
}

export default postsServices;