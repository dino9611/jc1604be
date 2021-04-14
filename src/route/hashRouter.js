const express = require("express");
const router = express.Router();

const { encryptController } = require("./../controllers");

const { gantihash } = encryptController;

router.get("/ganti", gantihash);

module.exports = router;
