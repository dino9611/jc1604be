const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://dino9611:pwdk123@cluster0.ydv5x.mongodb.net/belmongo?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// client
//   .connect()
//   .then(() => {
//     console.log("berhasil connect");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = client;
