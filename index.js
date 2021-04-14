"use strict";
const express = require("express");
const app = express();
const PORT = 5000;
const bodyParser = require("body-parser");
const { Logger, tampilkan } = require("./src/lib");
const cors = require("cors");
require("dotenv").config();
//? req --> middleware -->
app.use(cors());
//? untuk tempat middleware diakses semua endpoint
app.use(Logger);
//!  boleh body parser || boleh express
//? parse form data berguna untuk upload file /
app.use(bodyParser.urlencoded({ extended: false }));
//? parsing data dari json ke js untuk buat req.body ada juga buat parsing pada asaat axios/fetch di front end
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    const html = await tampilkan("./src/content/index.html");
    // console.log(html);
    res.status(200).send(html);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

const {
  usersRoutes,
  mongoRoutes,
  mongooseRoutes,
  hashRoutes,
} = require("./src/route");

app.use("/users", usersRoutes);
app.use("/mongo", mongoRoutes);
app.use("/mongoose", mongooseRoutes);
app.use("/hashrouter", hashRoutes);

app.all("*", (req, res) => {
  res.status(404).send("resource not found");
});

app.listen(PORT, () => console.log("listen in PORT " + PORT));
