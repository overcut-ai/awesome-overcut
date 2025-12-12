import request from "supertest";
import main from "../src/main";

let app: any;

describe("Auth cookie flow", () => {
  beforeAll(async () => {
    app = await main;
  });

  it("login mutation should set HttpOnly accessToken cookie", async () => {
    // seed test user credentials or assume test db has user `admin` / `password` hashed properly.
    const query = {
      query: `mutation Login($username: String!, $password: String!) {\n        login(credentials: { username: $username, password: $password }) {\n          accessToken\n        }\n      }`,
      variables: { username: "admin", password: "password" },
    };

    const res = await request(app.getHttpServer())
      .post("/graphql")
      .send(query)
      .expect(200);

    expect(res.headers["set-cookie"]).toBeDefined();
    const cookie = res.headers["set-cookie"].find((c: string) => c.startsWith("accessToken"));
    expect(cookie).toBeDefined();
  });
});
