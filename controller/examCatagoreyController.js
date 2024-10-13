const ExamCategory = require('../models/examCategoryModel');
const Subject = require('../models/subjectModel'); 

// Get all exam categories
exports.getExamCategories = async (req, res) => { 
  try {
    const examCategories = await ExamCategory.find().populate('subjects'); // Populate subjects
    res.status(200).json(examCategories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching exam categories' });
  }
};

// Add a new exam category
exports.addExamCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new ExamCategory({ name }); 
    await newCategory.save();
    res.status(201).json({ message: 'Exam category added', category: newCategory });
  } catch (error) {
    // Handle duplicate key errors if needed (error.code === 11000)
    res.status(500).json({ error: 'Error adding exam category' }); 
  }
};

// Add a subject to an exam category
exports.addSubjectToCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { name } = req.body;

    const newSubject = new Subject({ name, examCategory: categoryId });
    await newSubject.save(); 

    res.status(201).json({ message: 'Subject added to category', subject: newSubject });
  } catch (error) {
    res.status(500).json({ error: 'Error adding subject to category' });
  }
};

// ... (add controllers for updating or deleting categories and subjects as needed)