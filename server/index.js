const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3003;
const {
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  destroyReservation,
  client,
  fetchRestaurants,
  fetchCustomers,
  fetchReservations,
} = require("./db");

const init = async () => {
  const response = await createTables();
  //   const [Luisa, Alvaro, Cristina, Mariel, Coconut, Gaucho, CKF] =
  //     await Promise.all([
  //       createCustomer({ name: "Luisa" }),
  //       createCustomer({ name: "Alvaro" }),
  //       createCustomer({ name: "Cristina" }),
  //       createCustomer({ name: "Mariel" }),
  //       createRestaurant({ name: "Coconut" }),
  //       createRestaurant({ name: "Gaucho" }),
  //       createRestaurant({ name: "Savanna Jazz" }),
  //     ]);

  //   console.log(await fetchCustomers());
  //   console.log(await fetchRestaurants());
  //   const [reservation, reservation2] = await Promise.all([
  //     createReservation({
  //       customer_id: Juan.id,
  //       restaurant_id: Gaucho.id,
  //       date: "08/14/2024",
  //       party_count: 12,
  //     }),
  //     createReservation({
  //       customer_id: Mariel.id,
  //       restaurant_id: Coconut.id,
  //       date: "09/14/2024",
  //       party_count: 15,
  //     }),
  //   ]);
  //   console.log(await fetchReservations());

  app.listen(PORT, () => {
    console.log(`Hello from point number ${PORT}`);
  });
};

app.get("/api/customers", async (req, res) => {
  try {
    res.send(await fetchCustomers());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/restaurants", async (req, res) => {
  try {
    res.send(await fetchRestaurants());
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});

app.get("/api/reservations", async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});

app.post("/api/customer/", async (req, res) => {
  try {
    res.status(201).send(await createCustomer({ name: req.body.name }));
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});

app.post("/api/restaurant/", async (req, res, next) => {
  try {
    res.status(201).send(await createRestaurant({ name: req.body.name }));
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});

app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    res.status(201).send(
      await createReservation({
        customer_id: req.params.id,
        date: req.body.date,
        party_count: req.body.party_count,
        restaurant_id: req.body.restaurant_id,
      })
    );
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});

app.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      await destroyReservation({
        customer_id: req.params.customer_id,
        id: req.params.id,
      });
      res.sendStatus(204);
    } catch (ex) {
      console.log(ex);
      next(ex);
    }
  }
);

init();
