const express = require('express');
const router = express.Router();
const scriptController = require('../controllers/scriptController');

// Route to get all scripts
router.get('/', scriptController.getScripts);

// Route to add a new script
router.post('/', scriptController.addScript);

// Route to delete a script by id
router.delete('/:id', scriptController.deleteScript);

// Route to update a script by id
router.patch('/:id', scriptController.updateScript);

module.exports = router;
