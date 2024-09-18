const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Route to get all transactions
router.get('/', transactionController.getTransactions);
// Route to add a new transaction
router.post('/add', transactionController.addTransaction);
// Route to delete a transaction
router.delete('/:id', transactionController.deleteTransaction);
// Route to update a transaction
router.patch('/:id', transactionController.updateTransaction);

module.exports = router;
