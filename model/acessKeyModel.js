const mongoose = require('mongoose');

const accessKeySchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
  },
  key: { 
    type: String, 
    required: true,
    unique: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('AccessKey', accessKeySchema);