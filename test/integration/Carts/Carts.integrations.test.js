import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("--Testing del módulo de carts--", () => {
  let admin = {
    email: "coderad@hotmail.com",
    password: "coder1234",
  };
  let cookie;
  let jwt;
  const adminCid = "65caf0841a5363cb56ed4225";
  const productId = "654edfc544ec6bc97eef01cf";

  it("Obtener inicio de session de un usuario admin", async () => {
    const result = await requester.post("/api/users/login").send(admin);

    jwt = result.body.data;
    const cookieResult = result.headers["set-cookie"][0];
    const cookieSplit = cookieResult.split("=");
    cookie = {
      name: cookieSplit[0],
      value: cookieSplit[1],
    };

    expect(result.statusCode).to.be.eql(200);
  });

  it("Obtener todos los carritos con JWT activo", async () => {
    const response = await requester
      .get("/api/carts")
      .set("Authorization", `Bearer ${jwt}`);

    expect(response.statusCode).to.be.eql(200);
    expect(response.body.data.length).to.be.greaterThan(5);
  });

  it("Obtener todos los carritos sin JWT", async () => {
    const response = await requester.get("/api/carts");

    expect(response.statusCode).to.be.eql(401);
  });

  it("Obtener carrito del Admin", async () => {
    const response = await requester
      .get(`/api/carts/${adminCid}`)
      .set("Authorization", `Bearer ${jwt}`);

    expect(response.statusCode).to.be.eql(200);
    expect(response.body.data).to.include.keys("_id", "products", "__v");
  });

  it("Update del carrito del Admin not possible", async () => {
    const response = await requester
      .put(`/api/carts/${adminCid}/products/${productId}`)
      .set("Authorization", `Bearer ${jwt}`);

    console.log(response.body.data);

    expect(response.statusCode).to.be.eql(403);
  });
});
