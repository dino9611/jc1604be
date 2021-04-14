const { mongo } = require("./../connections");
const { ObjectID } = require("mongodb");
module.exports = {
  getdata: (req, res) => {
    const collection = mongo.db("toko").collection("users");
    // select * from belmongo.users limit 10
    collection
      .find(
        { usia: { $in: [29, 30] } }
        // { projection: { username: 1, _id: 0 } }
      )
      .limit(10)
      .toArray((err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
        // client.close();
        console.log("bisa");
        // mongo.close();
        res.send(result);
      });
  },
  getinvent: (req, res) => {
    const collection = mongo.db("toko").collection("inventory");
    collection
      .find()
      .toArray()
      .then((result) => {
        return res.status(200).send(result);
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  },
  // jika req.body object maka inserOne dan jika req.body array maka insermany
  postInventory: (req, res) => {
    const isArray = Array.isArray(req.body); //cek req.body object atau array
    const collection = mongo.db("toko").collection("inventory");
    if (isArray) {
      collection
        .insertMany(req.body)
        .then((result) => {
          console.log(result);
          collection
            .find()
            .toArray()
            .then((result1) => {
              return res.send(result1);
            })
            .catch((err) => {
              return res.status(500).send(err);
            });
        })
        .catch((err) => {
          return res.status(500).send(err);
        });
    } else {
      console.log("47");
      collection
        .insertOne(req.body)
        .then((result) => {
          console.log(result);
          collection
            .find()
            .toArray()
            .then((result1) => {
              return res.send(result1);
            })
            .catch((err) => {
              return res.status(500).send(err);
            });
        })
        .catch((err) => {
          return res.status(500).send(err);
        });
    }
  },
  deleteinvent: (req, res) => {
    const { id } = req.params;
    console.log(new ObjectID(id)); //khusus id harus pake object id
    const collection = mongo.db("toko").collection("inventory");
    collection
      .deleteMany({ _id: new ObjectID(id) })
      .then((result) => {
        // console.log(result);
        //get semua data lagi
        collection
          .find()
          .toArray()
          .then((result1) => {
            return res.send(result1);
          })
          .catch((err) => {
            return res.status(500).send(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  updateinvent: (req, res) => {
    const { id } = req.params;
    // req.body harus object
    const { set, unset } = req.body;
    let objupdte = { $currentDate: { lastModified: true } };
    if (set) {
      // set digunakan untuk menambahkan field atau mengedit value sebuah field
      objupdte = { $set: set, ...objupdte };
    }
    if (unset) {
      // fungsi unset adaah menghapus field
      objupdte = { $unset: unset, ...objupdte };
    }

    const collection = mongo.db("toko").collection("inventory");
    collection
      .updateOne({ _id: new ObjectID(id) }, objupdte)
      .then((result) => {
        console.log(result);
        //get semua data lagi
        collection
          .find()
          .toArray()
          .then((result1) => {
            return res.send(result1);
          })
          .catch((err) => {
            return res.status(500).send(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  hitunginvent: (req, res) => {
    // select count(*), group_concat from inventory where qty >= 25
    const collection = mongo.db("toko").collection("inventory");
    collection
      .aggregate([
        { $match: { qty: { $gte: 30 } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            items: { $push: "$item" },
          },
        },
      ])
      .toArray()
      .then((result) => {
        return res.send(result);
      });
  },
};
