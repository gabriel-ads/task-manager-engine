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

    it("Should be return a error on create task without title", async () => {
      const response = await request(app)
        .post("/task/create")
        .set("Cookie", rawRefreshTokenCookie)
        .send({
          title: "",
          description: "teste de descrição",
        });

      expect(response.statusCode).toBe(400);
      expect(response.text).toBe("O título deve ser preenchido");
    });

    it("Should be create a task without description", async () => {
      const response = await request(app)
        .post("/task/create")
        .set("Cookie", rawRefreshTokenCookie)
        .send({
          title: "teste",
          description: "",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        id: 2,
        title: "teste",
        description: "",
        status: null,
        authorId: 1,
      });
    });

    it("Should be create a task with another user", async () => {
      await request(app).post("/user/create").send({
        username: "gabriel2",
        email: "gabrielteste2",
        password: "123",
      });

      const newUserResponse = await request(app)
        .post("/user/login")
        .send({ username: "gabriel2", password: "123" });

      const newRawRefreshTokenCookie = newUserResponse.headers["set-cookie"];

      const response = await request(app)
        .post("/task/create")
        .set("Cookie", newRawRefreshTokenCookie)
        .send({
          title: "nova tarefa",
          description: "",
        });

      expect(response.statusCode).toBe(201);
      expect(response.body).toMatchObject({
        id: 3,
        title: "nova tarefa",
        description: "",
        status: null,
        authorId: 2,
      });
    });
  });

  describe("/", () => {
    it("Should be return the tasks", async () => {
      const response = await request(app)
        .get("/task/")
        .set("Cookie", rawRefreshTokenCookie);

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject([
        {
          id: 1,
          title: "teste criando task",
          description: "teste de descrição",
          status: null,
          authorId: 1,
        },
        {
          id: 2,
          title: "teste",
          description: "",
          status: null,
          authorId: 1,
        },
        {
          id: 3,
          title: "nova tarefa",
          description: "",
          status: null,
          authorId: 2,
        },
      ]);
    });
  });
  describe("/task/update/:id", () => {
    it("Should be update a task", async () => {
      const response = await request(app).put("/task/update");
    });
  });
});
