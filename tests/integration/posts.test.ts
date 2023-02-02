import app, { init } from "../../src/";
import { client } from "../../prisma/prisma";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../factories/usersFactory";
import { cleanDb, generateValidToken } from "../helpers";
import { createTrip } from "../factories/tripsFactory";
import { createPost } from "../factories/postsFactory";
import { any } from "joi";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);


describe("GET /posts/tripId", () => {
  it("should respond with status 401 if no token is given", async () => {

    const user = await createUser();
    const trip = await createTrip(user.id);

    const response = await server.get(`/posts/${trip.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const user = await createUser();
    const trip = await createTrip(user.id);

    const response = await server.get(`/posts/${trip.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

   describe("when token is valid", () => {
    it("should respond with status 404 if there is no such trip for given user", async () => {
      const user = await createUser(); 
      const user2 = await createUser();     
      const token = await generateValidToken(user2);
      const trip = await createTrip(user.id);

      const response = await server.get(`/posts/${trip.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);

    });

    it("should respond with status 200 and list containing the post", async () => {
      const user = await createUser();      
      const token = await generateValidToken(user);
      const trip = await createTrip(user.id);
      const post = await createPost(trip.id);

      const response = await server.get(`/posts/${trip.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([{
        id: post.id,
        text: post.text,
        image: post.image,
        createdAt: expect.any(String),
        tripId: trip.id,
      }]);
    });
  });
});

describe("POST /", () => {
  it("should respond with status 401 if no token is given", async () => {
    const user = await createUser();
    const trip = await createTrip(user.id);

    const response = await server.post(`/posts/${trip.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const user = await createUser();
    const trip = await createTrip(user.id);
    const token = faker.lorem.word();

    const response = await server.post(`/posts/${trip.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

    describe("when token is valid", () => {
    it("should respond with status 422 when body is not present", async () => {
      const user = await createUser();
      const trip = await createTrip(user.id);
      const token = await generateValidToken(user);

      const response = await server.post(`/posts/${trip.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(422);
    });

    it("should respond with status 422 when body is not valid", async () => {
      const user = await createUser();
      const trip = await createTrip(user.id);
      const token = await generateValidToken(user);
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.post(`/posts/${trip.id}`).set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(422);
    });    

    describe("when body is valid", () => {
      it("should respond with status 201 and create new trip", async () => {
        const user = await createUser();
        const trip = await createTrip(user.id);
        const body = {
            tripId: trip.id,
            text: faker.lorem.paragraph(),
            image: faker.internet.url(),
        };
        const token = await generateValidToken(user);

        const response = await server.post(`/posts/${trip.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.CREATED);
        const post = await client.posts.findFirst({ where: { tripId: trip.id } });
        expect(post).toBeDefined();
      });
    })
    })
});

describe("DELETE /posts/tripId/postId", () => {
  it("should respond with status 401 if no token is given", async () => {

    const user = await createUser();
    const trip = await createTrip(user.id);
    const post = await createPost(trip.id);

    const response = await server.delete(`/posts/${trip.id}/${post.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const user = await createUser();
    const trip = await createTrip(user.id);
    const post = await createPost(trip.id);

    const response = await server.delete(`/posts/${trip.id}/${post.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

   describe("when token is valid", () => {
    it("should respond with status 404 if there is no such post for given user", async () => {
      const user = await createUser(); 
      const user2 = await createUser();     
      const token = await generateValidToken(user2);
      const trip = await createTrip(user.id);
      const post = await createPost(trip.id);

      const response = await server.delete(`/posts/${trip.id}/${post.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);

    });

    it("should respond with status 204 if post is deleted and remove post from database", async () => {
      const user = await createUser();      
      const token = await generateValidToken(user);
      const trip = await createTrip(user.id);
      const post = await createPost(trip.id);

      const response = await server.delete(`/posts/${trip.id}/${post.id}`).set("Authorization", `Bearer ${token}`);
      const deletedPost = await client.posts.findFirst({ where: { id: trip.id }});

      expect(response.status).toBe(httpStatus.NO_CONTENT);
      expect(deletedPost).toBeNull();
    });
  });
});
