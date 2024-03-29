/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

const request = require("supertest");
const { app, server } = require("../index");
let rawRefreshTokenCookie;

beforeAll(async () => {
  await request(app).post("/user/create").send({
    username: "gabtest",
    email: "gabtest72",
    password: "12345",
  });
  const userResponse = await request(app).post("/user/login").send({
    username: "gabtest",
    password: "12345",
  });

  rawRefreshTokenCookie = userResponse.headers["set-cookie"];
});
afterAll(() => {
  server.close();
});
describe("Integration tests for Tasks router", () => {
  describe("/create", () => {
    it("Should be create task", async () => {
      const response = await request(app)
        .post("/task/create")
        .set("Cookie", rawRefreshTokenCookie)
        .send({
          title: "teste criando task",
          description: "teste de descrição",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        id: 1,
        title: "teste criando task",
        description: "teste de descrição",
        status: null,
        authorId: 1,
      });
    });
  });
  describe("/", () => {
    it("Should be return the tasks", () => {});
  });
});
