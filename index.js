"use strict";
const express = require("express");
const app = express();
const fs = require("fs");
const PORT = 5000;
const bodyParser = require("body-parser");
const { Logger } = require("./lib");
const cors = require("cors");
// req --> middleware -->
app.use(cors());
//? untuk tempat middleware diakses semua endpoint
app.use(Logger);
//!  boleh body parser || boleh express
//? parse form data berguna untuk upload file /
app.use(bodyParser.urlencoded({ extended: false }));
//? parsing data dari json ke js untuk buat req.body ada juga buat parsing pada asaat axios/fetch di front end
app.use(bodyParser.json());

const usersData = [
  {
    id: 1,
    username: "dino",
    password: "abc",
  },
  {
    id: 2,
    username: "zul",
    password: "abc",
  },
  {
    id: 3,
    username: "ommi",
    password: "abc",
  },
];
var idnext = 4;

// ! function return promise
const tampilkan = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, datas) => {
      if (err) {
        reject("ini error");
      } else {
        resolve(datas);
      }
    });
  });
};

app.get("/", async (req, res) => {
  try {
    const html = await tampilkan("./content/index.html");
    res.status(200).send(html);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.get("/users", (req, res) => {
  // check query kosong atau tidak kalo true kosong kalo false ada isi
  const checkquery =
    req.query &&
    Object.keys(req.query).length === 0 &&
    req.query.constructor === Object;

  if (!checkquery) {
    const { username, password } = req.query;
    if (!username || !password) {
      res.status(400).send({ message: "lack of query" });
    } else {
      const newdata = usersData.filter(
        (val) => val.username === username && val.password === password
      );
      if (newdata.length) {
        res.status(200).send(newdata);
      } else {
        res.send({ message: "user tidak ditemukan" });
      }
    }
  } else {
    res.send(usersData);
  }
});

app.post("/users", (req, res) => {
  const data = req.body;
  data.id = idnext;
  usersData.push(data);
  idnext++;
  res.status(201).send(usersData);
});

app.put("/users/:id", (req, res) => {
  var iddata = req.params.id;
  const data = req.body;
  console.log(data);
  var idx = usersData.findIndex((val) => val.id == iddata);
  if (data.username && data.password) {
    data.id = iddata;
    usersData.splice(idx, 1, data);
    res.send(usersData);
  } else {
    res.status(400).send({ message: "request body tidak penuh" });
  }
});

app.patch("/users/:id", (req, res) => {
  var iddata = req.params.id;
  const data = req.body;

  var idx = usersData.findIndex((val) => val.id == iddata);
  usersData[idx] = { ...usersData[idx], ...data };
  res.send(usersData);
});

app.delete("/users/:id", (req, res) => {
  var id = req.params.id;

  var idx = usersData.findIndex((val) => val.id == id);
  if (idx < 0) {
    res.status(404).send({ message: "id not found" });
  } else {
    usersData.splice(idx, 1);
    res.send(usersData);
  }
});

// todo : buat api yang bisa get semua product, terus bisa filter dengan hargamax, dan harga min,
// kalo misalkan hanya harga min/max berarti tetep bisa difilter
// get all nya bisa juga bisa punya paging querynya page dengan limitnya 3
// sisanya tambah edit delete
const dataProduct = [
  {
    nama: "popok hokage",
    descripsi: "membuat bayi anda menjadi hokage",
    harga: 30000,
  },
  {
    nama: "kunai",
    descripsi: "membuat bayi anda jago bermain kunai",
    harga: 100000,
  },
  {
    nama: "dragon blood",
    descripsi: "membuat bayi anda jadi naga",
    harga: 50000,
  },
  {
    nama: "keyboard sumail",
    descripsi: "membuat bayi anda menjadi jago seperti sumail",
    harga: 70000,
  },
  {
    nama: "dewa kapak",
    descripsi: "membuat bayi anda jago bermain kapak",
    harga: 150000,
  },
  {
    nama: "tongkat kera sakti",
    descripsi: "membuat bayi anda jadi sun go kong",
    harga: 250000,
  },
];

app.get("/products", (req, res) => {
  const checkquery =
    req.query &&
    Object.keys(req.query).length === 0 &&
    req.query.constructor === Object;
  if (!checkquery) {
    console.log(req.query);
    let { hargamax, hargamin, page, limit } = req.query;

    let filterdata = dataProduct.filter((val) => {
      let param1, param2;
      if (!hargamax) {
        param1 = true;
      } else {
        param1 = val.harga <= hargamax;
      }
      if (!hargamin) {
        param2 = true;
      } else {
        param2 = val.harga >= hargamin;
      }
      return param1 && param2;
    });

    if (!limit) {
      limit = 3;
    }
    if (!page) {
      page = 1;
    }
    const pagefor = (page - 1) * limit;
    let newarr = [];
    for (let i = pagefor; i < limit * page; i++) {
      if (filterdata[i]) {
        newarr.push(filterdata[i]);
      }
    }
    res.send(newarr);
  } else {
    res.send(dataProduct);
  }
});

app.all("*", (req, res) => {
  res.status(404).send("resource not found");
});

app.listen(PORT, () => console.log("listen in PORT " + PORT));
