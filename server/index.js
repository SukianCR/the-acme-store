const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3022;
const {
  createTables,
  createUser,
  createProduct,
  createFavorite,
  destroyFavorite,
  client,
  fetchProducts,
  fetchUsers,
  fetchFavorites,
} = require("./db");

const init = async () => {
  const response = await createTables();
  // const [lucia, maria, laura, book, bike, skate, lamp] = await Promise.all([
  //   createUser({ username: "lucia", password: "s3cr3t" }),
  //   createUser({ username: "maria", password: "s3cr3t!!" }),
  //   createUser({ username: "laura", password: "shhh" }),
  //   createProduct({ name: "book" }),
  //   createProduct({ name: "bike" }),
  //   createProduct({ name: "skate" }),
  //   createProduct({ name: "lamp" }),
  // ]);
  // console.log(lucia.id);
  // console.log(maria.id);

  app.listen(PORT, () => {
    console.log(`Hello from point number ${PORT}`);
  });
};

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});

app.get("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.send(await fetchFavorites(req.params.id));
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});

app.post("/api/user/", async (req, res, next) => {
  try {
    res.status(201).send(
      await createUser({
        username: req.body.username,
        password: req.body.password,
      })
    );
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});

app.post("/api/product/", async (req, res, next) => {
  try {
    res.status(201).send(await createProduct({ name: req.body.name }));
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});

app.post("/api/users/:id/favorites", async (req, res, next) => {
  try {
    console.log("entro a fav post");
    res.status(201).send(
      await createFavorite({
        user_id: req.params.id,
        product_id: req.body.product_id,
      })
    );
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});

app.delete("/api/users/:user_id/favorites/:id", async (req, res, next) => {
  try {
    await destroyFavorite({
      user_id: req.params.user_id,
      id: req.params.id,
    });
    res.sendStatus(204);
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});

init();

//to practice:
// const [lucia, maria, laura, book, bike, skate, lamp] = await Promise.all([
//   createUser({ username: "lucia", password: "s3cr3t" }),
//   createUser({ username: "maria", password: "s3cr3t!!" }),
//   createUser({ username: "laura", password: "shhh" }),
//   createProduct({ name: "book" }),
//   createProduct({ name: "bike" }),
//   createProduct({ name: "skate" }),
//   createProduct({ name: "lamp" }),
// ]);
// console.log(lucia.id);
// console.log(maria.id);
