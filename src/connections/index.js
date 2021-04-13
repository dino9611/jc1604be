const db = require("./mysqldb");
const mongo = require("./mongodb");
module.exports = {
  mysqldb: db,
  mongo: mongo,
};
