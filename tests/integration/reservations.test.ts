import app, { init } from "../../src/";
import { client } from "../../prisma/prisma";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../factories/usersFactory";
import { cleanDb, generateValidToken } from "../helpers";
import { createTrip } from "../factories/tripsFactory";
import { createReservation } from "../factories/reservationsFactory";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);


describe("GET /reservations/tripId", () => {
  it("should respond with status 401 if no token is given", async () => {

    const user = await createUser();
    const trip = await createTrip(user.id);

    const response = await server.get(`/reservations/${trip.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const user = await createUser();
    const trip = await createTrip(user.id);

    const response = await server.get(`/reservations/${trip.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

   describe("when token is valid", () => {
    it("should respond with status 404 if there is no such trip for given user", async () => {
      const user = await createUser(); 
      const user2 = await createUser();     
      const token = await generateValidToken(user2);
      const trip = await createTrip(user.id);

      const response = await server.get(`/reservations/${trip.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);

    });

    it("should respond with status 200 and list containing the reservation", async () => {
      const user = await createUser();      
      const token = await generateValidToken(user);
      const trip = await createTrip(user.id);
      const reservation = await createReservation(trip.id);

      const response = await server.get(`/reservations/${trip.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([{
        id: reservation.id,
        title: reservation.title,
        code: reservation.code,
        type: reservation.type,
        tripId: trip.id,
      }]);
    });
  });
});

describe("POST /", () => {
  it("should respond with status 401 if no token is given", async () => {
    const user = await createUser();
    const trip = await createTrip(user.id);

    const response = await server.post(`/reservations/${trip.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const user = await createUser();
    const trip = await createTrip(user.id);
    const token = faker.lorem.word();

    const response = await server.post(`/reservations/${trip.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

    describe("when token is valid", () => {
    it("should respond with status 422 when body is not present", async () => {
      const user = await createUser();
      const trip = await createTrip(user.id);
      const token = await generateValidToken(user);

      const response = await server.post(`/reservations/${trip.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(422);
    });

    it("should respond with status 422 when body is not valid", async () => {
      const user = await createUser();
      const trip = await createTrip(user.id);
      const token = await generateValidToken(user);
      const body = { [faker.lorem.word()]: faker.lorem.word() };

      const response = await server.post(`/reservations/${trip.id}`).set("Authorization", `Bearer ${token}`).send(body);

      expect(response.status).toBe(422);
    });    

    describe("when body is valid", () => {
      it("should respond with status 201 and create new trip", async () => {
        const user = await createUser();
        const trip = await createTrip(user.id);
        const body = {
            tripId: trip.id,
            title: faker.word.noun(),
            code: faker.internet.password(8),
            type: "Transport"
        };
        const token = await generateValidToken(user);

        const response = await server.post(`/reservations/${trip.id}`).set("Authorization", `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.CREATED);
        const reservation = await client.reservations.findFirst({ where: { tripId: trip.id } });
        expect(reservation).toBeDefined();
      });
    })
    })
});

describe("DELETE /reservations/tripId/reservationId", () => {
  it("should respond with status 401 if no token is given", async () => {

    const user = await createUser();
    const trip = await createTrip(user.id);
    const reservation = await createReservation(trip.id);

    const response = await server.delete(`/reservations/${trip.id}/${reservation.id}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
    const user = await createUser();
    const trip = await createTrip(user.id);
    const reservation = await createReservation(trip.id);

    const response = await server.delete(`/reservations/${trip.id}/${reservation.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

   describe("when token is valid", () => {
    it("should respond with status 404 if there is no such reservation for given user", async () => {
      const user = await createUser(); 
      const user2 = await createUser();     
      const token = await generateValidToken(user2);
      const trip = await createTrip(user.id);
      const reservation = await createReservation(trip.id);

      const response = await server.delete(`/reservations/${trip.id}/${reservation.id}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);

    });

    it("should respond with status 204 if reservation is deleted and remove reservation from database", async () => {
      const user = await createUser();      
      const token = await generateValidToken(user);
      const trip = await createTrip(user.id);
      const reservation = await createReservation(trip.id);

      const response = await server.delete(`/reservations/${trip.id}/${reservation.id}`).set("Authorization", `Bearer ${token}`);
      const deletedReservation = await client.reservations.findFirst({ where: { id: trip.id }});

      expect(response.status).toBe(httpStatus.NO_CONTENT);
      expect(deletedReservation).toBeNull();
    });
  });
});
