const mongoose = require('mongoose');

const examPaperSchema = new mongoose.Schema({
  exam: { 
    type: String, 
    enum: ['Leaving Certificate', 'Junior Cycle'], 
    required: true 
  },
  subject: {  // Reference to the Subject model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },

  year: { // Add the year of the exam paper
    type: Number, 
    required: true 
  },
  paperType: { // E.g., 'Mock Exam', 'State Exam'
    type: String, 
    required: true 
  },
  fileUrl: {  // URL to the stored PDF file
    type: String, 
    required: true 
  },
  chapters: {  // URL to the stored PDF file
    type: [String], 
    required: true 
  },
  
  
  // Add other relevant fields like uploadedBy (user), uploadDate, etc.
});

module.exports = mongoose.model('ExamPaper', examPaperSchema);