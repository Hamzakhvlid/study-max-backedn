const path = require("path");
const fs = require("fs");
const categoryModel = require("../model/categoryModel");
const asyncHandler = require("../utils/AsyncHandler");
const { uploadOnCloudinary, deleteImage } = require("../utils/cloudinary");

module.exports = {
  createCategory: asyncHandler(async (req, res) => {
    try {
      const { categoryName, categoryId, categoryDesc } = req.body;

      console.log(categoryName.categoryImage);

      const LocalPath = req.file?.path;
      if (!LocalPath) {
        return res.status(400).send("No File uploaded");
      }

      console.log(LocalPath);

      const ImageUrl = await uploadOnCloudinary(LocalPath);

      const newCategory = new categoryModel({
        categoryName,
        categoryId,
        categoryImage: {
          public_id: ImageUrl.public_id,
          url: ImageUrl.url,
        },
        categoryDesc,
      });

      await newCategory.save();
      res
        .status(201)
        .json({ message: "Category created successfully", newCategory });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }),

  editCategory: asyncHandler(async (req, res) => {
    try {
      const CategoryId = req.params.id;
      const categoryPath = req.file ? req.file.path : null;
      const { categoryName, categoryId, categoryImage } = req.body;

      console.log(categoryName, categoryId, categoryImage);

      // Find the category by ID
      const Category = await categoryModel.findById(CategoryId);

      if (!Category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // If a new image file is uploaded, replace the old image in Cloudinary
      if (categoryPath) {
        const public_id = Category.categoryImage.public_id;
        console.log(public_id);

        // Delete the old image from Cloudinary
        await deleteImage(public_id); // assuming this function deletes by public_id

        // Upload the new image to Cloudinary
        const newCategory = await uploadOnCloudinary(categoryPath);

        if (newCategory) {
          // Set the new image in the category
          Category.categoryImage = {
            public_id: newCategory.public_id,
            url: newCategory.url,
          };
        }
      }

      // Update the category fields if provided
      if (categoryName) Category.categoryName = categoryName;
      if (categoryId) Category.categoryId = categoryId;

      // This condition seems redundant because we already handle the category image
      // when there's a file upload. Remove it unless it's a specific requirement.
      if (categoryImage !== undefined) {
        Category.categoryImage = categoryImage;
      }

      // Save the updated category
      await Category.save();

      // Send response with the updated category
      res
        .status(200)
        .json({ message: "Category updated successfully", Category });
    } catch (error) {
      // Handle errors and send a response with the error message
      res.status(500).json({ error: error.message });
    }
  }),

  getAllCategories: asyncHandler(async (req, res) => {
    try {
      const categories = await categoryModel.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }),

  getCategory: asyncHandler(async (req, res) => {
    const categorydbId = req.params.id;
    try {
      const responce = await categoryModel.findById(categorydbId);

      res.json(responce);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }),

  deleteCategory: asyncHandler(async (req, res, next) => {
    try {
      const CategoryId = req.params.id;
      const Category = await categoryModel.findById(CategoryId);

      if (!Category) {
        return res.status(404).send("Product not found");
      }
      await deleteImage(Category.categoryImage.public_id);

      await categoryModel.findByIdAndDelete(CategoryId);

      res.status(200).send("Product and associated files deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).send("Error deleting product");
    }
  }),
};
