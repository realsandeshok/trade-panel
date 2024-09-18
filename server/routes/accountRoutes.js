// routes/accountRoutes.js
const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');

// Route to get all accounts
router.get('/', accountController.getAccounts);
// Route to add a new account
router.post('/', accountController.addAccount);
// Route to delete an account
router.delete('/:id', accountController.deleteAccount);
// Route to update an account
router.patch('/:id', accountController.updateAccount);

module.exports = router;
