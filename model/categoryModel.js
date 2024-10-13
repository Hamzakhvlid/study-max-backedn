const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
    },
    categoryDesc: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
      required: true,
    },
    categoryImage: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("Categories", categorySchema);
module.exports = categoryModel;
