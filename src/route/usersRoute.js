const express = require("express");
const router = express.Router();

const { userControllers } = require("./../controllers");
const {
  getUsers,
  postUsers,
  editUsers,
  deleteUser,
  gantipassword,
} = userControllers;

// fitur register
// fitur add to cart dengan table , checkout
// fitur lupa password; input email

router.get("/", getUsers);

router.post("/", postUsers);

router.put("/:id", editUsers);

router.put("/editpass/:id", gantipassword);

router.delete("/:id", deleteUser);

module.exports = router;
