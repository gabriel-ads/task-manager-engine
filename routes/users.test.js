/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

const request = require("supertest");
const { app, server } = require("../index");

const createUserRoute = "/user/create";
const loginUserRoute = "/user/login";

afterAll(() => {
  server.close();
});
describe("Integration tests for User router", () => {
  describe("/create", () => {
    it("Should be create a new user", async () => {
      const response = await request(app).post(createUserRoute).send({
        username: "gabtest",
        email: "gabtest72",
        password: "12345",
      });

      expect(response.status).toBe(201);
      expect(response.text).toBe("Criado com sucesso");
    });

    it("Should be return error on create a duplicated user username", async () => {
      const response = await request(app).post(createUserRoute).send({
        username: "gabtest",
        email: "gabtest72",
        password: "12345",
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe("E-mail ou Username já existente");
    });

    it("Should be return error on create a duplicated user email", async () => {
      const response = await request(app).post(createUserRoute).send({
        username: "gabtestasd",
        email: "gabtest72",
        password: "12345",
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe("E-mail ou Username já existente");
    });

    it("Should be return error on create a user that username contains blank spaces", async () => {
      const response = await request(app).post(createUserRoute).send({
        username: "gab test",
        email: "gabtest72",
        password: "12345",
      });

      expect(response.status).toBe(400);
      expect(response.text).toBe("Username não deve conter espaços");
    });
  });

  describe("/login", () => {
    it("Should be login a user", async () => {
      const response = await request(app).post(loginUserRoute).send({
        username: "gabtest",
        password: "12345",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("username");
      expect(response.body).toHaveProperty("email");
    });

    it("Should be return error to login a user with incorret username", async () => {
      const response = await request(app).post(loginUserRoute).send({
        username: "gab",
        password: "12345",
      });

      expect(response.status).toBe(403);
      expect(response.text).toBe("Usuário ou senha inválido!");
    });

    it("Should be return error to login a user with incorret password", async () => {
      const response = await request(app).post(loginUserRoute).send({
        username: "gabtest",
        password: "1234",
      });

      expect(response.status).toBe(403);
      expect(response.text).toBe("Usuário ou senha inválido!");
    });
  });
});
