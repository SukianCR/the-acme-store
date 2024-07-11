const pg = require("pg");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/the_acme_store_db"
);

const createTables = async () => {
  await client.connect();
  let SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
   
    CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(20) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    );
    CREATE TABLE products(
        id UUID PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
    );
    CREATE TABLE favorites(
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES products(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_favorite UNIQUE (product_id, user_id)
        
    );
  `;

 // await client.query(SQL);
};

const createUser = async ({ username, password }) => {
  const SQL = `
          INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *;
      `;

  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 5),
  ]);
  return response.rows[0];
};

const createProduct = async ({ name }) => {
  const SQL = `
          INSERT INTO products(id, name) VALUES($1, $2) RETURNING *;
      `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows;
};

const createFavorite = async ({ user_id, product_id }) => {
  console.log("entro a create fav");
  console.log("user_id", user_id, "product id", product_id);
  const SQL = `
        INSERT INTO favorites( id, user_id, product_id) VALUES($1, $2, $3) RETURNING *;
    `;
  console.log(SQL);
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  return response.rows[0];
};

const destroyFavorite = async ({ id, user_id }) => {
  console.log(id, user_id);
  const SQL = `
        DELETE from favorites
        WHERE id = $1 AND user_id = $2;
      `;
  const response = await client.query(SQL, [id, user_id]);
  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `
          SELECT * from products
      `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchUsers = async () => {
  const SQL = `
          SELECT * from users
      `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchFavorites = async (user_id) => {
  const SQL = `
          SELECT users.username as user, products.name as product from users
          INNER JOIN favorites as favo
          on users.id = favo.user_id
          INNER JOIN products
          on favo.product_id = products.id
          where users.id = $1;
      `;

  console.log("sql es" + SQL);

  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

module.exports = {
  createTables,
  createUser,
  createProduct,
  createFavorite,
  destroyFavorite,
  client,
  fetchProducts,
  fetchUsers,
  fetchFavorites,
};
