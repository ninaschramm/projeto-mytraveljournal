import app, { init } from "../../src/";
import faker from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../factories/usersFactory";
import { cleanDb } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /signin", () => {
  it("should respond with status 422 when body is not given", async () => {
    const response = await server.post("/signin");

    expect(response.status).toBe(422);
  });

  it("should respond with status 422 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/signin").send(invalidBody);

    expect(response.status).toBe(422);
  });

  describe("when body is valid", () => {
    const generateValidBody = () => ({
      username: faker.internet.userName(),
      password: faker.internet.password(8),
    });

    it("should respond with status 401 if there is no user for given username", async () => {
      const body = generateValidBody();

      const response = await server.post("/signin").send(body);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("should respond with status 401 if there is a user for given username but password is not correct", async () => {
      const body = generateValidBody();
      await createUser(body);

      const response = await server.post("/signin").send({
        ...body,
        password: faker.lorem.word(8),
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when credentials are valid", () => {
      it("should respond with status 200", async () => {
        const body = generateValidBody();
        await createUser(body);

        const response = await server.post("/signin").send(body);

        expect(response.status).toBe(httpStatus.OK);
      });
      
      it("should respond with session token", async () => {
        const body = generateValidBody();
        await createUser(body);

        const response = await server.post("/signin").send(body);

        expect(response.text).toBeDefined();
      });
    });
  });
});
