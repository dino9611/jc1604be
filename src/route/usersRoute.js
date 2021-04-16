const express = require("express");
const router = express.Router();

const { userControllers } = require("./../controllers");
const { verifyTokenAccess } = require("./../helpers/verifyToken");
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

// router.use(VerifyToken); // kalo mau semua routing users memakai verify

router.get("/", getUsers);

router.post("/", postUsers);

router.put("/:id", editUsers);

router.put("/editpass/:id", gantipassword);

router.delete("/:id", deleteUser);

module.exports = router;
