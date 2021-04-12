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

const { mysqldb } = require("./src/connections");

app.get("/", async (req, res) => {
  try {
    const html = await tampilkan("./src/content/index.html");
    console.log(html);
    res.status(200).send(html);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//? get/Read

app.get("/users", (req, res) => {
  const { username, password } = req.query;
  let sql;
  console.log(username);
  let escape = [];
  if (username && password) {
    // ! escape untuk input yang tidak dipercaya
    // sql = `select * from users where username=${connection.escape(
    //   username
    // )} and  password = ${connection.escape(password)}`;
    // ! escape cara lain
    sql = `select * from users where username= ? and  password = ?`;
    escape = [username, password];
  } else {
    //get semua user
    sql = `select * from users`;
  }
  mysqldb.query(sql, escape, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    console.log(result);

    return res.send(result);
  });
});

//? post/create

app.post("/users", (req, res) => {
  console.log(req.body);
  let data = req.body;
  // let data = {
  //   password: req.body.password,
  //   username: req.body.username,
  //   kota: req.body.kota,
  // };
  console.log(data);
  mysqldb.query(`insert into users set ?`, data, (err, result) => {
    if (err) return res.status(500).send(err);
    // console.log("kebaca line 98", result); //? disini ada insert id
    mysqldb.query(`select * from users`, (err, result1) => {
      if (err) return res.status(500).send(err);
      // console.log(result1);
      return res.send(result1);
    });
  });
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const data = req.body;
  mysqldb.query(`update users set ? where id =?`, [data, id], (err, result) => {
    if (err) return res.status(500).send(err);
    // console.log("kebaca line 117", result);
    mysqldb.query(`select * from users`, (err, result1) => {
      if (err) return res.status(500).send(err);
      return res.send(result1);
    });
  });
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;

  mysqldb.query(`delete from users where id =?`, [id], (err, result) => {
    if (err) return res.status(500).send(err);
    // console.log("kebaca line 134", result);
    mysqldb.query(`select * from users`, (err, result1) => {
      if (err) return res.status(500).send(err);
      return res.send(result1);
    });
  });
});

app.all("*", (req, res) => {
  res.status(404).send("resource not found");
});

app.listen(PORT, () => console.log("listen in PORT " + PORT));
