const { mysqldb } = require("./../connections");
const { createTransport } = require("nodemailer");
const hashpassword = require("./../helpers/hashingpass");
const {
  createAccessToken,
  createEmailVerifiedToken,
} = require("./../helpers/createToken");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
let transporter = createTransport({
  service: "gmail",
  auth: {
    user: "dinotestes12@gmail.com",
    pass: "ngmudtdpjoaunnec",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = {
  sendEmail: (req, res) => {
    let filepath = path.resolve(__dirname, "../content/email_template.html");
    // let filepath1 = __dirname + "../content/conthemail.html";
    const htmlrender = fs.readFileSync(filepath, "utf-8");
    const template = handlebars.compile(htmlrender);
    const htmltoemail = template({ username: "dino", link: "www.google.com" });
    // console.log(filepath);
    // console.log(filepath1, "tanpa resolve");
    // console.log(htmltoemail);
    transporter
      .sendMail({
        from: "raja bajak laut <dinotestes12@gmail.com>",
        to: "dinopwdk@gmail.com",
        subject: "Hai BGST konfirm",
        html: htmltoemail,
      })
      .then((res1) => {
        console.log(res1);
        return res.send("berhasil");
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  },
  verifiedEmailwithoutToken: (req, res) => {
    const { id } = req.params;
    let dataUpdate = {
      isverified: 1,
    };
    let sql = `update users set ? where id = ?`;
    mysqldb.query(sql, [dataUpdate, id], (err, result) => {
      if (err) return res.status(500).send(err);
      sql = `select id,username,email,isverified,role from users where id = ? `;
      mysqldb.query(sql, [id], (err, datauser) => {
        if (err) return res.status(500).send({ message: err });
        return res.send(datauser[0]);
      });
    });
  },
  verifiedEmailwithToken: (req, res) => {
    const { id } = req.user;
    let dataUpdate = {
      isverified: 1,
    };
    let sql = `update users set ? where id = ?`;
    mysqldb.query(sql, [dataUpdate, id], (err, result) => {
      if (err) return res.status(500).send(err);
      sql = `select id,username,email,isverified,role from users where id = ? `;
      mysqldb.query(sql, [id], (err, datauser) => {
        if (err) return res.status(500).send({ message: err });
        return res.send(datauser[0]);
      });
    });
  },
  sendEmailVerification: (req, res) => {
    const { id, email, username } = req.body;
    const datatoken = {
      id: id,
      username: username,
    };
    const tokenverified = createEmailVerifiedToken(datatoken);
    transporter
      .sendMail({
        from: "raja bajak laut <dinotestes12@gmail.com>",
        to: email,
        subject: "Hai konfirm",
        html: `<h1>hai ${username}</h1> <a href='http://localhost:3000/verified/${tokenverified}'>link verifikasi<a/> `,
      })
      .then((res1) => {
        console.log(res1);
        return res.status(200).send({ message: "email berhasil dikirim" });
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  },
  Register: (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).send({ message: "bad request" });
    }
    const data = {
      username,
      password: hashpassword(password),
      email,
    };
    // cek data user apakah data username atau pass sudah dipakai di db
    let sql = `select * from users where username = ? `;
    mysqldb.query(sql, [username], (err, result0) => {
      if (err) return res.status(500).send({ message: err });
      if (result0.length) {
        return res
          .status(500)
          .send({ message: "username / email has been registered" });
      }
      //   insert data user to table users
      sql = `insert users set ?`;
      mysqldb.query(sql, data, (err, result) => {
        if (err) return res.status(500).send({ message: err });

        const iduser = result.insertId;
        // get datauser
        sql = `select id,username,email,isverified,role from users where id = ? `;
        mysqldb.query(sql, [iduser], (err, datauser) => {
          if (err) return res.status(500).send({ message: err });
          // cart kosong karena pada saat register cart udah pasti kosong
          const datatoken = {
            id: datauser[0].id,
            username: datauser[0].username,
          };
          const token = createAccessToken(datatoken);
          const tokenverified = createEmailVerifiedToken(datatoken);
          transporter
            .sendMail({
              from: "raja bajak laut <dinotestes12@gmail.com>",
              to: datauser[0].email,
              subject: "Hai konfirm",
              html: `<h1>hai ${datauser[0].username}</h1> <a href='http://localhost:3000/verified/${tokenverified}'>link verifikasi<a/> `,
            })
            .then((res1) => {
              console.log(res1);
              return res
                .status(200)
                .send({ ...datauser[0], cart: [], token: token });
            })
            .catch((err) => {
              return res.status(500).send(err);
            });
        });
      });
    });
  },
  login: (req, res) => {
    const { usernameOremail, password } = req.body;
    const hashpass = hashpassword(password);
    if (!usernameOremail || !password) {
      return res.status(400).send({ message: "bad request" });
    }
    let sql = `select id,username,email,isverified,role 
    from users where (username = ? or email = ?) and password = ?`;
    mysqldb.query(
      sql,
      [usernameOremail, usernameOremail, hashpass],
      (err, datauser) => {
        if (err) return res.status(500).send({ message: err });
        // anggap cart masih kosong
        // jangan lupa query untuk cart
        if (datauser.length) {
          const datatoken = {
            id: datauser[0].id,
            username: datauser[0].username,
          };
          const token = createAccessToken(datatoken);

          return res
            .status(200)
            .send({ ...datauser[0], cart: [], token: token });
        } else {
          return res.status(500).send({ message: "login gagal" });
        }
      }
    );
  },
  verifiedToken: (req, res) => {
    // const { token } = req.body;
    // jika tidak pake berare token
    const authHeader = req.headers["authorization"];
    console.log(req.headers);
    const token = authHeader && authHeader.split(" ")[1];
    // console.log(token);
    const key = "saitama";
    jwt.verify(token, key, (err, decoded) => {
      if (err) return res.status(401).send({ message: "user unauthorized" });
      console.log(decoded);
      res.send(decoded);
    });
  },
};
