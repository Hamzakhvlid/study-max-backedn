const CurrentType =require("../model/typeModel");
const asyncHandler = require("../utils/asyncHandler"); // Error handling middleware

module.exports = {
  // Get all Current Types
  getCurrentTypes: asyncHandler(async (req, res) => {
    const currentTypes = await CurrentType.find();
    res.json(currentTypes);
  }),

  // Add a new Current Type
  addCurrentType: asyncHandler(async (req, res) => {
    const newCurrentType = new CurrentType({
      name: req.body.name,
    });

    const savedCurrentType = await newCurrentType.save();
    res.status(201).json(savedCurrentType); 
  }),

  // Delete a Current Type by ID
  deleteCurrentType: asyncHandler(async (req, res) => {
    const deletedCurrentType = await CurrentType.findByIdAndDelete(
      req.params.id
    );

    if (!deletedCurrentType) {
      return res.status(404).json({ message: "Current Type not found" }); 
    }

    res.json({ message: "Current Type deleted successfully" });
  }),
};