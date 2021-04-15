const Crypto = require("crypto");
const { mysqldb } = require("./../connections");
const jwt = require("jsonwebtoken");
const hashpassword = (password) => {
  var katakunci = process.env.HASH_KEY;
  return Crypto.createHmac("sha256", katakunci).update(password).digest("hex");
};

module.exports = {
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
    let sql = `select * from users where username = ? or email = ?`;
    mysqldb.query(sql, [username, email], (err, result0) => {
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
          const key = "saitama";
          const token = jwt.sign(datatoken, key, { expiresIn: "2h" });
          return res
            .status(200)
            .send({ ...datauser[0], cart: [], token: token });
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
          const key = "saitama";
          const token = jwt.sign(datatoken, key, { expiresIn: "2h" });
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
