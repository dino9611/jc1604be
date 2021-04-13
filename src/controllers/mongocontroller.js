const { mongo } = require("./../connections");

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
};
