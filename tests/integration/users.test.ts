import app, { init } from "../../src/";
import { client } from "../../prisma/prisma";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import supertest from "supertest";
import { createUser } from "../factories/usersFactory";
import { cleanDb } from "../helpers";
import { duplicatedEmailError, duplicatedUsernameError } from "utils/errorUtils";

beforeAll(async () => {
  await init();
  await cleanDb();
});

const server = supertest(app);

describe("POST /signup", () => {
  it("should respond with status 422 when body is not given", async () => {
    const response = await server.post("/signup");

    expect(response.status).toBe(422);
  });

  it("should respond with status 422 when body is not valid", async () => {
    const invalidBody = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post("/signup").send(invalidBody);

    expect(response.status).toBe(422);
  });

  it("should respond with status 422 when passwords do not match", async () => {    
    const password = faker.internet.password(7);

    const generateInvalidBody = () => ({
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: password,
      confirmPassword: password,
    });

    const invalidBody = generateInvalidBody();

    const response = await server.post("/signup").send(invalidBody);

    expect(response.status).toBe(422);
  });

  it("should respond with status 422 when passwords is shorter than 8 chars", async () => {
    const generateInvalidBody = () => ({
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(8),
      confirmPassword: faker.internet.password(8),
    });

    const invalidBody = generateInvalidBody();

    const response = await server.post("/signup").send(invalidBody);

    expect(response.status).toBe(422);
  });

  describe("when body is valid", () => {
    const password = faker.internet.password(8);
    const generateValidBody = () => ({
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password,
      confirmPassword: password,
    });

      it("should respond with status 409 when there is an user with given email", async () => {
      const body = generateValidBody();
      const sameEmailbody = { ...body, username: faker.internet.userName() }
      await createUser(body);

      const response = await server.post("/signup").send(sameEmailbody);

      expect(response.status).toBe(httpStatus.CONFLICT);
      expect(response.body).toEqual(duplicatedEmailError());
    });

    it("should respond with status 409 when there is an user with given username", async () => {
      const body = generateValidBody();
      const sameUsernameBody = { ...body, email: faker.internet.email() }
      await createUser(body);

      const response = await server.post("/signup").send(sameUsernameBody);

      expect(response.status).toBe(httpStatus.CONFLICT);
      expect(response.body).toEqual(duplicatedUsernameError());
    });

      it("should respond with status 201 and create user when given email and username are unique", async () => {
        const body = generateValidBody();

        const response = await server.post("/signup").send(body);

        expect(response.status).toBe(httpStatus.CREATED);
      });

      it("should not return user password on body", async () => {
        const body = generateValidBody();

        const response = await server.post("/signup").send(body);

        expect(response.body).not.toHaveProperty("password");
      });

      it("should save user on db", async () => {
        const body = generateValidBody();

        const response = await server.post("/signup").send(body);

        const user = await client.user.findUnique({
          where: { email: body.email },
        });
        expect(user).toEqual(
          expect.objectContaining({
            username: body.username,
            email: body.email,
          }),
        );
      });
    });
  });
