const express = require("express");
const router = express.Router();

const { userControllers } = require("./../controllers");
const { getUsers, postUsers, editUsers, deleteUser } = userControllers;

router.get("/", getUsers);

router.post("/", postUsers);

router.put("/:id", editUsers);

router.delete("/:id", deleteUser);

module.exports = router;
