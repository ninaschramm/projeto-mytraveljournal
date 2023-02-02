import app, { init } from "../../src/";
import { client } from "../../prisma/prisma";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../factories/usersFactory";
import { cleanDb, generateValidToken } from "../helpers";
import { createTrip } from "../factories/tripsFactory";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("GET /", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.get("/").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

   describe("when token is valid", () => {
    it("should respond with status 200 and an empty list when there is no trip for given user", async () => {
      const token = await generateValidToken();

      const response = await server.get("/").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body.length).toEqual(0);

    });

    it("should respond with status 200 and list of trips for given user", async () => {
      const user = await createUser();      
      const token = await generateValidToken(user);
      const trip = await createTrip(user.id);

      const response = await server.get("/").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([{
        id: trip.id,
        title: trip.title,
        startsAt: trip.startsAt.toISOString(),
        endsAt: trip.endsAt.toISOString(),
        userId: user.id,
      }]);
    });
  });
});

describe("GET /tripId", () => {
  it("should respond with status 401 if no token is given", async () => {

    const user = await createUser();
    const trip = await createTrip(user.id);

    const response = await server.get(`/${trip.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const user = await createUser();
    const trip = await createTrip(user.id);

    const response = await server.get(`/${trip.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

   describe("when token is valid", () => {
    it("should respond with status 404 if there is no such trip for given user", async () => {
      const user = await createUser(); 
      const user2 = await createUser();     
      const token = await generateValidToken(user2);
      const trip = await createTrip(user.id);

      const response = await server.get(`/${trip.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);

    });

    it("should respond with status 200 and trip info for given trip", async () => {
      const user = await createUser();      
      const token = await generateValidToken(user);
      const trip = await createTrip(user.id);

      const response = await server.get(`/${trip.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: trip.id,
        title: trip.title,
        startsAt: trip.startsAt.toISOString(),
        endsAt: trip.endsAt.toISOString(),
        userId: user.id,
      });
    });
  });
});

describe("POST /", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.post("/");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();

    const response = await server.post("/").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

    describe("when token is valid", () => {
    it("should respond with status 422 when body is not present", async () => {
      const token = await generateValidToken();

      const response = await server.post("/").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(422);
    });

    it("should respond with status 422 when body is not valid", async () => {
      const token = await generateValidToken();
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.post("/").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(422);
    });

    it("should respond with status 422 when start date is after end date", async () => {
      const user = await createUser();
      const body = {
        userId: user.id,
        title: faker.word.noun(),
        startsAt: new Date ('2023-07-04'),
        endsAt: new Date ('2023-06-04')
      };
      const token = await generateValidToken(user);

      const response = await server.post("/").set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(422);
    });

    describe("when body is valid", () => {
      it("should respond with status 201 and create new trip", async () => {
        const user = await createUser();
        const body = {
          userId: user.id,
          title: faker.word.noun(),
          startDate: new Date ('2023-05-04'),
          endDate: new Date ('2023-06-04')
        }
        const token = await generateValidToken(user);

        const response = await server.post("/").set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.CREATED);
        const trip = await client.trips.findFirst({ where: { userId: user.id } });
        expect(trip).toBeDefined();
      });
    })
    })
});

describe("DELETE /tripId", () => {
  it("should respond with status 401 if no token is given", async () => {

    const user = await createUser();
    const trip = await createTrip(user.id);

    const response = await server.delete(`/${trip.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const user = await createUser();
    const trip = await createTrip(user.id);

    const response = await server.delete(`/${trip.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

   describe("when token is valid", () => {
    it("should respond with status 404 if there is no such trip for given user", async () => {
      const user = await createUser(); 
      const user2 = await createUser();     
      const token = await generateValidToken(user2);
      const trip = await createTrip(user.id);

      const response = await server.delete(`/${trip.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);

    });

    it("should respond with status 204 if trip is deleted and remove trip from database", async () => {
      const user = await createUser();      
      const token = await generateValidToken(user);
      const trip = await createTrip(user.id);

      const response = await server.delete(`/${trip.id}`).set("Authorization", `Bearer ${token}`);
      const deletedTrip = await client.trips.findFirst({ where: { id: trip.id }});

      expect(response.status).toBe(httpStatus.NO_CONTENT);
      expect(deletedTrip).toBeNull();
    });
  });
});
