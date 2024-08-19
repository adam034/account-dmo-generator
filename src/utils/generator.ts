import { faker } from "@faker-js/faker";

export function generateRandomUser(domain: string) {
  const randomNumber = Math.floor(Math.random() * (100 - 1 + 1)) + 1;
  return {
    address: `${faker.person
      .firstName()
      .toLowerCase()}${randomNumber}@${domain}`,
    password: `${faker.person.firstName().toLowerCase()}${randomNumber}`,
  };
}
