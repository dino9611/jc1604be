const Crypto = require("crypto");

function hashword(password) {
  var katakunci = "silverfang";
  return Crypto.createHmac("sha256", katakunci).update(password).digest("hex");
}

module.exports = {
  gantihash: (req, res) => {
    const hash = hashword(req.query.word);
    return res
      .status(200)
      .send({ panjang: hash.length, hash: hash, word: req.query.word });
  },
};
