/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

const request = require("supertest");
const { app, server } = require("../index");

beforeAll(() => {
  server.close();
});
describe("Testing user routes", () => {
  it("Should be create a new user", async () => {
    const response = await request(app).post("/user/create").send({
      username: "gabtest",
      email: "gabtest72",
      password: "12345",
    });

    expect(response.status).toBe(201);
    expect(response.text).toBe("Criado com sucesso");
  });
});
