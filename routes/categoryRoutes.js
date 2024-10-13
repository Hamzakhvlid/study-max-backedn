const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const categoryController = require("../controller/categoryController");
const parentDir = path.dirname(__dirname);
const uploadDir = path.join(parentDir, "uploads", "categories");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/categories");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/createCategory",
  upload.single("categoryImage"),
  categoryController.createCategory
);

router.put(
  "/editCategory/:id",
  upload.single("categoryImage"),
  categoryController.editCategory
);

router.get("/getCategories", categoryController.getAllCategories);


router.get("/getCategory/:id", categoryController.getCategory);



router.delete("/deleteCategory/:id", categoryController.deleteCategory);
module.exports = router;
