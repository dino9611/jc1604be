const userControllers = require("./usersController");
const mongoController = require("./mongocontroller");
const mongooseController = require("./mongooseController");
const encryptController = require("./encryptController");

module.exports = {
  userControllers,
  mongoController,
  mongooseController,
  encryptController,
  AuthController: require("./AuthController"),
  ProductController: require("./productController"),
  SocketController: require("./socketController"),
};
