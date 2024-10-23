const Subject = require('../model/subjectModel');

exports.addSubject = async (req, res) => {
  try {
    const { exam, name, levels } = req.body;

    const newSubject = new Subject({
      exam,
      name,
      levels: levels || [], // Handle cases where no levels are provided
    });

    await newSubject.save();

    res.status(201).json({
      message: 'Subject added successfully',
      subject: newSubject,
    });

  } catch (error) {
    console.error('Error adding subject:', error);
    res.status(500).json({ error: 'Error adding subject' });
  }
};

exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects); 
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Error fetching subjects' });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    console.log(req.params.id);
    const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
    if (!deletedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ error: 'Error deleting subject' });
  }
};

// ... add other controller functions (getSubjectById, updateSubject, deleteSubject) as needed