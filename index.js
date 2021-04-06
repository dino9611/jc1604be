const http = require("http");
const Mymodules = require("./modules");
const { addString, data, users } = Mymodules;
const fs = require("fs");
const url = require("url");

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
  //   console.log(req.url);
  const urlparse = url.parse(req.url);
  //   console.log(req.url);
  //   console.log(urlparse);
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-type": "text/html" });
    // with promise async await
    try {
      const html = await tampilkan("./content/index.html");
      console.log(typeof html);
      console.log(html);
      res.end(html.replace("{{name}}", data.nama));
    } catch (error) {
      console.log(error);
    }
    // promise original
    // tampilkan("./content/index.html")
    //   .then((res1) => {
    //     console.log(typeof res1);
    //     console.log(res1);
    //     res.end(res1.replace("{{name}}", data.nama));
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });

    //   !without promis
    //  fs.readFile("./content/index.html", "utf-8", (err, datas) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }
    //   console.log(typeof datas);

    //   res.end(datas.replace("{{name}}", data.nama));
    // });
  } else if (req.url === "/users" && req.method === "POST") {
    req.on("data", (datas) => {
      console.log(JSON.parse(datas));
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(JSON.stringify(users));
    });
  } else {
    console.log(req.params);
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify(users));
  }
});

server.listen(5000, () => console.log("server on port 5000"));

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
