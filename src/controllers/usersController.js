const { mysqldb } = require("./../connections");
const util = require("util");
const dba = util.promisify(mysqldb.query).bind(mysqldb);
module.exports = {
  getUsers: (req, res) => {
    // console.log(req.user, "hasil dari token");
    const { username, password } = req.query;
    let sql;
    // console.log(username);
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

      // console.log(result);

      return res.send(result);
    });
  },
  postUsers: (req, res) => {
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
  },
  editUsers: (req, res) => {
    const { id } = req.params;
    const data = req.body;
    mysqldb.query(
      `update users set ? where id =?`,
      [data, id],
      (err, result) => {
        if (err) return res.status(500).send(err);
        // console.log("kebaca line 117", result);
        mysqldb.query(`select * from users`, (err, result1) => {
          if (err) return res.status(500).send(err);
          return res.send(result1);
        });
      }
    );
  },
  deleteUser: (req, res) => {
    const { id } = req.params;

    mysqldb.query(`delete from users where id =?`, [id], (err, result) => {
      if (err) return res.status(500).send(err);
      // console.log("kebaca line 134", result);
      mysqldb.query(`select * from users`, (err, result1) => {
        if (err) return res.status(500).send(err);
        return res.send(result1);
      });
    });
  },

  gantipassword: async (req, res) => {
    try {
      const { passlama, passbaru } = req.body;
      const { id } = req.params;
      const datausers = await dba("select * from users where id = ?", [id]); //hasilnya array
      if (datausers.length) {
        if (datausers[0].password === passlama) {
          const data = {
            password: passbaru,
          };
          // console.log(data, "91");
          await dba(`update users set ? where id = ?`, [data, id]);
          const allUsers = await dba("select * from users where id");
          return res.status(200).send(allUsers);
        } else {
          return res.status(500).send({ message: "password lama salah" });
        }
      } else {
        return res.status(500).send({ message: "id not found" });
      }
    } catch (error) {
      return res.status(500).send(error);
    }
  },
};
