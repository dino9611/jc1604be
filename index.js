"use strict";
const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const PORT = process.env.PORT || 5000;
// const bodyParser = require("body-parser");
const { Logger, tampilkan } = require("./src/lib");
const cors = require("cors");
const bearerToken = require("express-bearer-token");
app.use(bearerToken());
require("dotenv").config();
//? req --> middleware -->
app.use(cors());
//? untuk tempat middleware diakses semua endpoint
app.use(Logger);
//!  boleh body parser || boleh express
//? parse form data berguna untuk upload file /
app.use(express.urlencoded({ extended: false }));
//? parsing data dari json ke js untuk buat req.body ada juga buat parsing pada asaat axios/fetch di front end
app.use(express.json());
//? menyediakan file statis
app.use(express.static("public"));

const server = http.createServer(app);
const io = socketIo(server);
var userCount = 0;

let MSG = [];

app.io = io; // buat mendistribusikan function io kedalam controler
app.msg = MSG;

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

app.get("/coba", (req, res) => {
  res.set("cobasss", "tesaja"); //header request
  res.status(200).send({ coba: "ddd" });
});

const {
  usersRoutes,
  mongoRoutes,
  mongooseRoutes,
  hashRoutes,
  AuthRoutes,
  ProductRoutes,
  SocketRoutes,
} = require("./src/route");

app.use("/users", usersRoutes);
app.use("/products", ProductRoutes);
app.use("/auth", AuthRoutes);
app.use("/mongo", mongoRoutes);
app.use("/mongoose", mongooseRoutes);
app.use("/hashrouter", hashRoutes);
app.use("/socket", SocketRoutes);

app.all("*", (req, res) => {
  res.status(404).send("resource not found");
});

io.on("connection", (socket) => {
  userCount++;
  console.log("bebas");
  io.emit("user connected", userCount);

  socket.on("disconnect", () => {
    console.log("user disconnected");
    userCount--;
    io.emit("user connected", userCount);
  });
});

server.listen(PORT, () => console.log("listen in PORT " + PORT));
