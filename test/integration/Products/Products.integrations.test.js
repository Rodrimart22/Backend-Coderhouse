import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

describe("--Testing del módulo de Products--", () => {
  let premium = {
    email: "coderpr@hotmail.com",
    password: "coder1234",
  };
  let cookie;
  let jwt;
  const adminCid = "65cbcada7541171bf88c9d0b";
  const productId = "";
  const newProduct = {
    title: "Laptop ASUS ZenBook",
    description:
      "Laptop ultradelgada con pantalla Full HD, procesador Intel Core i7 y 16 GB de RAM.",
    code: "xyz123",
    price: 1299.99,
    status: true,
    stock: 20,
    category: "Electrónicos",
    thumbnails: [],
  };
  let newProductId = "65cbcf247541171bf88c9d73";

  it("Obtener inicio de session de un usuario PREMIUM", async () => {
    const result = await requester.post("/api/users/login").send(premium);

    jwt = result.body.data;
    const cookieResult = result.headers["set-cookie"][0];
    const cookieSplit = cookieResult.split("=");
    cookie = {
      name: cookieSplit[0],
      value: cookieSplit[1],
    };

    expect(result.statusCode).to.be.eql(200);
  });

  it("Obtener todos los productos con JWT", async () => {
    const response = await requester
      .get(`/api/products`)
      .set("Authorization", `Bearer ${jwt}`);

    expect(response.statusCode).to.be.eql(200);
    expect(response.body.data.length).to.be.gte(5);
    expect(response.body.data[0]).to.includes.all.keys(
      "_id",
      "title",
      "description",
      "code",
      "price",
      "status",
      "stock",
      "category",
      "thumbnails",
      "__v"
    );
  });

  it("Obtener todos los productos sin JWT", async () => {
    const response = await requester.get(`/api/products`);

    expect(response.statusCode).to.be.eql(401);
  });

  it("Publicar nuevo producto como Premium", async () => {
    const response = await requester
      .post(`/api/products`)
      .set("Authorization", `Bearer ${jwt}`)
      .send(newProduct);

    newProductId = response.body.data._id;

    expect(response.statusCode).to.be.eql(201);
    expect(response.body.data.owner).to.be.eql(premium.email);
  });

  it("Borrar el producto como Premium", async () => {
    const response = await requester
      .delete(`/api/products/${newProductId}`)
      .set("Authorization", `Bearer ${jwt}`);

    expect(response.statusCode).to.be.eql(200);
  });
});
