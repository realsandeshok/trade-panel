const express = require('express');
const router = express.Router();
const holdingsController = require('../controllers/holdingsController');

// Define the route to get holdings with transactions
router.get('/', holdingsController.getHoldingsWithTransactions);

module.exports = router;
