const express = require("express");
const router = express.Router();

const { ProductController } = require("./../controllers");

const {
  getproducts,
  postProduct,
  updateProducts,
  deleteproduct,
} = ProductController;

router.get("/", getproducts);
router.post("/", postProduct);
router.put("/:id", updateProducts);
router.delete("/:id", deleteproduct);

module.exports = router;
