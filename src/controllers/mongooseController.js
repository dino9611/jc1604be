const uri =
  "mongodb+srv://dino9611:pwdk123@cluster0.ydv5x.mongodb.net/toko?retryWrites=true&w=majority";
const mongoose = require("mongoose");
const products = require("./../models/productsModels");

mongoose.connect(
  uri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("connect mongoose");
    }
  }
);

module.exports = {
  initData: (req, res) => {
    products({
      name: "shampo",
      qty: 10,
      images: ["foto", "foto1"],
      description: "abcderf",
    })
      .save()
      .then((result) => {
        console.log(result);
        products.find().then((result1) => {
          return res.status(200).send(result1);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  initbanyak: (req, res) => {
    products
      .insertMany([
        {
          name: "buku",
          qty: 10,
          images: ["foto", "foto1"],
          size: {
            weight: 10,
            unit: "gram",
          },
          description: "abcderf",
        },
        {
          name: "pena",
          qty: 10,
          images: ["foto", "foto1"],
          size: {
            weight: 10,
            unit: "gram",
          },
          description: "abcderf",
        },
      ])
      .then((result) => {
        console.log(result);
        products.find().then((result1) => {
          return res.status(200).send(result1);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  },
  deletedata: async (req, res) => {
    try {
      const { id } = req.params;
      let datadihapus = await products.findByIdAndDelete(id);
      console.log(datadihapus);
      let allprod = await products.find();
      return res.status(200).send(allprod);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  updatedata: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      let editdata = await products.findByIdAndUpdate(id, {
        $set: { name: name },
      });
      console.log(editdata);
      let allprod = await products.find();
      return res.status(200).send(allprod);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
  getall: async (req, res) => {
    try {
      let allprod = await products.find();
      return res.status(200).send(allprod);
    } catch (error) {
      return res.status(500).send(error);
    }
  },
};
