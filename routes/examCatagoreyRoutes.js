const express = require('express');
const router = express.Router();
const examCategoryController = require('../controllers/examCategoryController');

router.get('/', examCategoryController.getExamCategories);
router.post('/', examCategoryController.addExamCategory);

// Nested route for subjects within a category
router.post('/:categoryId/subjects', examCategoryController.addSubjectToCategory);

// ... (add routes for updating/deleting categories and subjects)

module.exports = router; 