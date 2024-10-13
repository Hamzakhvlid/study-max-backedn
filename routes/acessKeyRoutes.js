const express = require('express');
const router = express.Router();
const accessKeyController = require('../controller/accessKeyController');

// Routes
router.get('/', accessKeyController.getAccessKeys);
router.post('/', accessKeyController.generateAccessKey);
router.delete('/:keyId', accessKeyController.revokeAccessKey); 

module.exports = router;