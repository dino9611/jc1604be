const usersRoutes = require("./usersRoute");
const mongoRoutes = require("./mongorouter");
const mongooseRoutes = require("./mongooseRouter");
const hashRoutes = require("./hashRouter");
module.exports = {
  usersRoutes,
  mongoRoutes,
  mongooseRoutes,
  hashRoutes,
  AuthRoutes: require("./AuthRouter"),
};
