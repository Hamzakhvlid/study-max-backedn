const express = require('express');
const router = express.Router();
const subjectController = require('../controller/subjectController');

router.post('/', subjectController.addSubject);
router.get('/', subjectController.getAllSubjects); 

// ... add other routes for getting by ID, updating, deleting 

module.exports = router;