const fs = require("fs");
const { mysqldb } = require("../connections");
const { uploader } = require("./../lib");

module.exports = {
  getproducts: (req, res) => {
    mysqldb.query(`select * from products`, (err, result) => {
      if (err) return res.status(500).send(err);

      return res.status(200).send(result);
    });
  },
  postProduct: (req, res) => {
    try {
      const path = "/products"; //ini terserah

      const upload = uploader(path, "PROD").fields([{ name: "image" }]);
      upload(req, res, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Upload picture failed !", error: err.message });
        }
        console.log("berhasil upload");
        console.log(req.files);
        const { image } = req.files;
        //console.log(image); // nanti sebuah array karena menngunakan fields
        const imagePath = image ? path + "/" + image[0].filename : null;
        console.log(imagePath);
        console.log(req.body.data);
        const data = JSON.parse(req.body.data);
        data.image = imagePath;
        console.log(data);
        mysqldb.query("insert into products set ?", data, (err, result) => {
          if (err) {
            if (imagePath) {
              fs.unlinkSync("./public" + imagePath);
            }
            return res.status(500).send(err);
          }
          let sql = `select * from products`;
          mysqldb.query(sql, (err, dataproduct) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(dataproduct);
          });
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
  },
  // get dulu datanya by id , hapus datanya delete fotonya di api menggunakan unlink

  deleteproduct: (req, res) => {
    const { id } = req.params;
    let sql = `select * from products where id = ?`;
    mysqldb.query(sql, [id], (err, result) => {
      if (err) return res.status(500).send(err);
      sql = `delete from products where id = ?`;
      mysqldb.query(sql, [id], (err) => {
        if (err) return res.status(500).send(err);
        if (result[0].image) {
          // hapus foto di dalam server api jika image tidak null
          fs.unlinkSync("./public" + result[0].image);
        }
        let sql = `select * from products`;
        mysqldb.query(sql, (err, dataproduct) => {
          if (err) return res.status(500).send(err);
          return res.status(200).send(dataproduct);
        });
      });
    });
  },
  // get data yang mau di edit untuk dapeting imagepath lama
  //   upload foto baru, update data jika gagal update maka hapus foto baru
  // jika update berhasil maka hapus foto lama
  updateProducts: (req, res) => {
    const { id } = req.params;
    let sql = `select * from products where id = ?`;
    mysqldb.query(sql, [id], (err, result) => {
      if (err) return res.status(500).send(err);
      try {
        const path = "/products"; //ini terserah
        const upload = uploader(path, "PROD").fields([{ name: "image" }]);
        upload(req, res, (err) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Upload picture failed !", error: err.message });
          }
          console.log("berhasil upload");
          console.log(req.files);
          const { image } = req.files;
          //console.log(image); // nanti sebuah array karena menngunakan fields
          const imagePath = image ? path + "/" + image[0].filename : null;
          console.log(imagePath);
          console.log(req.body.data);
          const data = JSON.parse(req.body.data);
          if (imagePath) {
            data.image = imagePath;
          }
          console.log(data);
          mysqldb.query(
            "update products set ? where id = ?",
            [data, id],
            (err) => {
              if (err) {
                //hapus foto baru jika update gagal
                if (imagePath) {
                  fs.unlinkSync("./public" + imagePath);
                }
                return res.status(500).send(err);
              }
              if (imagePath) {
                //hapus foto lama
                if (result[0].image) {
                  fs.unlinkSync("./public" + result[0].image);
                }
              }
              let sql = `select * from products`;
              mysqldb.query(sql, (err, dataproduct) => {
                if (err) return res.status(500).send(err);
                return res.status(200).send(dataproduct);
              });
            }
          );
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send(error);
      }
    });
  },
};
