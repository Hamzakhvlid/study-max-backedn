const mongoose = require('mongoose');

const markingSchemeSchema = new mongoose.Schema({
  examPaper: { // Reference to the ExamPaper this marking scheme belongs to
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamPaper', 
    required: true
  },
  year: { 
    type: Number, 
    required: true 
  },
  fileUrl: { // URL to the stored PDF file 
    type: String, 
    required: true 
  },
  // Add other relevant fields as needed
});

module.exports = mongoose.model('MarkingScheme', markingSchemeSchema);