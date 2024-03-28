/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

const request = require("supertest");
const { app, server } = require("../index");
let rawRefreshTokenCookie;
const fakeAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VybmFtZSI6ImdhYnRlc3QiLCJlbWFpbCI6ImdhYnRlc3Q3MiIsInBhc3N3b3JkIjoiJDJiJDEwJEhHczJjUTRtYlVUVTdVZUZ6ZmI3SWVTSlUxRm4xNnI0L2Ztek5jZnV1T2pVOTJ3Zk1MMjFXIn0sImlhdCI6MTcxMTY2MTk1OCwiZXhwIjoxNzExNjY1NTU4fQ.d0JwgBsh8OkDVosvzzs1xJKV58-buKMuDTJGSqrdxeE";

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
        .set("Authorization", fakeAccessToken)
        .send({
          title: "teste criando task",
          description: "teste de descrição",
        });
      //   console.log(response);
    });
  });
  describe("/", () => {
    it("Should be return the tasks", () => {});
  });
});
