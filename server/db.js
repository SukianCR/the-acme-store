const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://localhost/the_acme_reservation_planner_db"
);

const createTables = async () => {
  await client.connect();
  let SQL = `
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS restaurants;
    DROP TABLE IF EXISTS customers;
   
    CREATE TABLE customers(
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );
    CREATE TABLE restaurants(
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );
    CREATE TABLE reservations(
        id UUID PRIMARY KEY,
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
        customer_id UUID REFERENCES customers(id) NOT NULL
    );
  `;
};

const createCustomer = async ({ name }) => {
  const SQL = `
          INSERT INTO customers(id, name) VALUES($1, $2) RETURNING *;
      `;

  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows;
};

const createRestaurant = async ({ name }) => {
  const SQL = `
          INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *;
      `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows;
};

const createReservation = async ({
  date,
  party_count,
  customer_id,
  restaurant_id,
}) => {
  console.log(date, party_count, customer_id, restaurant_id);
  const SQL = `
        INSERT INTO reservations(id, date, party_count, customer_id, restaurant_id) VALUES($1, $2, $3, $4, $5) RETURNING *;
    `;
  const response = await client.query(SQL, [
    uuid.v4(),
    date,
    party_count,
    customer_id,
    restaurant_id,
  ]);
  return response.rows[0];
};

const destroyReservation = async ({ id, customer_id }) => {
  console.log(id, customer_id);
  const SQL = `
        DELETE from reservations
        WHERE id = $1 AND customer_id = $2;
      `;

  const response = await client.query(SQL, [id, customer_id]);
  return response.rows;
};

const fetchRestaurants = async () => {
  const SQL = `
          SELECT * from restaurants
      `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchCustomers = async () => {
  const SQL = `
          SELECT * from customers
      `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchReservations = async () => {
  //   const SQL = `
  //         SELECT customers.name as name, restaurants.name as Restaurant from customers
  //         INNER JOIN reservations as reserv
  //         on customers.id = reserv.customer_id
  //         INNER JOIN restaurants
  //         on reserv.restaurant_id = restaurants.id
  //         where customers.id = $1;
  //     `;
  const SQL = `SELECT * from reservations`;
  const response = await client.query(SQL);
  return response.rows;
};

module.exports = {
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  destroyReservation,
  client,
  fetchRestaurants,
  fetchCustomers,
  fetchReservations,
};
