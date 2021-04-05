// const http = require("http");
// const Mymodules = require("./modules");
// const { addString, data, users } = Mymodules;
// const server = http.createServer((req, res) => {
//   //   console.log(req.url);
//   if (req.url === "/") {
//     res.writeHead(200, { "Content-type": "text/html" });
//     res.end("<h1>halo gais </h1>");
//   } else {
//     res.writeHead(200, { "Content-type": "application/json" });
//     res.end(JSON.stringify(users));
//   }
// });

// server.listen(5000, () => console.log("server on port 5000"));

// const { nama, isStudent } = require("./app");
// const studentkah = require("./app").isStudent;
// const { kalimat } = require("./app");
// const kata2 = require("./students");

// console.log(kalimat());
// console.log(isStudent);

const fs = require("fs");

// const file = fs.readFileSync("./content/nama.txt", "utf-8");
// const stream = fs.createReadStream("./content/nama.txt");
// fs.mkdirSync("./content/foto");
fs.renameSync("./content/iniaja.txt", "./content/foto/catetan.txt");
console.log("success");
