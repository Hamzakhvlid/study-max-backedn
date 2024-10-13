// ./models/examCategoryModel.js
const mongoose = require('mongoose');

const examCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure category names are unique
  }
});

module.exports = mongoose.model('ExamCategory', examCategorySchema); 

// ./models/subjectModel.js
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  examCategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'ExamCategory', 
    required: true, 
  },
});

module.exports = mongoose.model('Subject', subjectSchema);