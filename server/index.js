const http = require("http");
const Mymodules = require("./modules");
const { addString, data, users } = Mymodules;
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");
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

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,POST,PUT,DELETE,PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "content-type");

  const urlparse = url.parse(req.url);

  // console.log(urlparse);
  if (req.url === "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    // with promise async await
    try {
      const html = await tampilkan("./content/index.html");
      console.log(typeof html);
      console.log(html);
      res.end(html);
    } catch (error) {
      console.log(error);
    }
  } else if (urlparse.pathname === "/users" && req.method === "GET") {
    // pertama dicheck dulu query null atau tidak
    // kalau null maka responnya adalah ambil semua data
    // kalau tidak null maka query akan digunakan untuk memfilter data
    // pada kasus ini query username dan password harus ada jika salah satu tidak ada maka
    // beri respon error dengan kode 400 which means request error
    // jika ada dua-duanya maka filter data hasilnya akan menjadi response
    if (urlparse.query) {
      const query = querystring.parse(urlparse.query);
      const { username, password } = query;
      if (!username || !password) {
        res.writeHead(400, { "Content-type": "application/json" });
        res.end(JSON.stringify({ message: "lack of query" }));
      } else {
        const newdata = usersData.filter(
          (val) => val.username === username && val.password === password
        );
        if (newdata.length) {
          res.writeHead(200, { "Content-type": "application/json" });
          res.end(JSON.stringify(newdata));
        } else {
          res.writeHead(200, { "Content-type": "application/json" });
          res.end(JSON.stringify({ message: "user tidak ditemukan" }));
        }
      }
    } else {
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(JSON.stringify(usersData));
    }
  } else if (urlparse.pathname === "/users" && req.method === "POST") {
    req.on("data", (body) => {
      // wajib 'data'
      console.log(JSON.parse(body));
      const data = JSON.parse(body);
      data.id = idnext;
      usersData.push(data);
      idnext++;
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(JSON.stringify(usersData));
    });
  } else if (urlparse.pathname.includes("/users") && req.method === "PUT") {
    // put untuk update/edit data
    req.on("data", (body) => {
      // console.log(urlparse, "coba");
      const data = JSON.parse(body);
      var id = urlparse.pathname.split("/")[2];
      if (id) {
        var idx = usersData.findIndex((val) => val.id === id);
        if (data.username && data.password) {
          data.id = id;
          usersData.splice(idx - 1, 1, data);
          res.writeHead(200, { "Content-type": "application/json" });
          res.end(JSON.stringify(usersData));
        } else {
          res.writeHead(400, { "Content-type": "application/json" });
          res.end(JSON.stringify({ message: "request body tidak penuh" }));
        }
      } else {
        res.writeHead(400, { "Content-type": "application/json" });
        res.end(JSON.stringify({ message: "request wrong" }));
      }
    });
  } else if (urlparse.pathname.includes("/users") && req.method === "DELETE") {
    var id = urlparse.pathname.split("/")[2];
    if (id) {
      var idx = usersData.findIndex((val) => val.id === id);
      if (idx < 0) {
        res.writeHead(400, { "Content-type": "application/json" });
        res.end(JSON.stringify({ message: "id not found" }));
      } else {
        usersData.splice(idx - 1, 1);
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify(usersData));
      }
    } else {
      res.writeHead(400, { "Content-type": "application/json" });
      res.end(JSON.stringify({ message: "request wrong" }));
    }
  } else {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify(users));
  }
});

server.listen(5001, () => console.log("server on port 5001"));

// const { nama, isStudent } = require("./app");
// const studentkah = require("./app").isStudent;
// const { kalimat } = require("./app");
// const kata2 = require("./students");

// console.log(kalimat());
// console.log(isStudent);

// const file = fs.readFileSync("./content/nama.txt", "utf-8");
// const stream = fs.createReadStream("./content/nama.txt");
// fs.mkdirSync("./content/foto");
// const fs = require("fs");

// fs.readFile("./content/index.html", "utf-8", (err, data) => {
//   if (err) {
//     console.log(err);
//     return;
//   }
//   console.log(data);
//   console.log("sukses");
// });

// api CRUD GET,POST,PUT/PATCH, DELETE
