const mongoose = require("mongoose");

const Schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      required: true,
    },
    images: [String],
    size: {
      weight: Number,
      unit: String,
    },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", Schema);
