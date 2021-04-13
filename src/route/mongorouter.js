const express = require("express");
const router = express.Router();

const { mongoController } = require("./../controllers");
const { getdata } = mongoController;

router.get("/", getdata);

module.exports = router;
