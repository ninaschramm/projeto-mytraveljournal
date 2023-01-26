import { Prisma } from '@prisma/client';
import { client } from '../../prisma/prisma'

async function getPostsByTrip(tripId: number) {
    const result = await client.posts.findMany({
        where:
         { 
            tripId,
         }
    });
    
    return result;
}

async function addNewPost(data: Prisma.PostsUncheckedCreateInput) {
    const post = await client.posts.create({
        data
    });

    return post;
}

async function removePost(postId: number) {
    const post = await client.posts.delete({
        where: {
            id: postId
        }
    });

    return post;
}

const postsRepository = {
    getPostsByTrip,
    addNewPost,
    removePost,
}

export default postsRepository;