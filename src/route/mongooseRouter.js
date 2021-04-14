const express = require("express");
const router = express.Router();

const { mongooseController } = require("./../controllers");

const {
  initData,
  initbanyak,
  deletedata,
  getall,
  updatedata,
} = mongooseController;

router.get("/iniaja", initData);
router.get("/initbanyak", initbanyak);
router.get("/", getall);
router.put("/:id", updatedata);
router.delete("/:id", deletedata);

module.exports = router;
