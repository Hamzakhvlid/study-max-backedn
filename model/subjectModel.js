const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  exam: {
    type: String,
    enum: ['Leaving Certificate', 'Junior Cycle'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  levels: [{ 
    type: String 
  }] 
});

module.exports = mongoose.model('Subject', subjectSchema);