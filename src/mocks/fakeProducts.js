import { fakerES as faker } from "@faker-js/faker";

const generateProductsMock = (quantity = 100) => {
  //Vamos a generar 100 productos de manera randómica
  let products = [];

  for (let i = 0; i <= quantity; i++) {
    products.push(generateProduct());
  }

  return products;
};

const generateProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.string.alphanumeric(10),
    price: faker.commerce.price({ max: 3000 }),
    status: faker.datatype.boolean(),
    stock: faker.number.int(15),
    category: faker.commerce.department(),
    thumbnails: [faker.image.url(), faker.image.url(), faker.image.url()],
    __v: 0,
  };
};

export { generateProductsMock };
