const express = require("express");
const router = express.Router();

const { mongoController } = require("./../controllers");

const {
  getdata,
  postInventory,
  getinvent,
  deleteinvent,
  updateinvent,
  hitunginvent,
} = mongoController;

router.get("/", getdata);
router.get("/invent", getinvent);
router.post("/invent", postInventory);
router.delete("/invent/:id", deleteinvent);
router.put("/invent/:id", updateinvent);
router.get("/hitinvent", hitunginvent);
module.exports = router;
