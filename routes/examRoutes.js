const express = require('express');
const router = express.Router();
const examPaperController = require('../controller/examController'); // Assuming your controller file is named examPaperController.js
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// --- Exam Paper Routes --- 

// GET all exam papers
router.get('/', examPaperController.getAllExamPapers);

// GET a specific exam paper by ID
router.get('/:id', examPaperController.getExamPaperById);

// POST a new exam paper
router.post('/', upload.fields([
    { name: 'pdfFile', maxCount: 1 },
    { name: 'markingScheme', maxCount: 1 }
  ]), examPaperController.addExamPaper); 

// PUT (update) an existing exam paper 
router.put('/:id', examPaperController.updateExamPaper);

// DELETE an exam paper
router.delete('/:id', examPaperController.deleteExamPaper);

module.exports = router; 