const holdingsModel = require('../models/holdingsModel');

// Controller function to handle the API request for fetching holdings with transactions
const getHoldingsWithTransactions = async (req, res) => {
  try {
    const holdings = await holdingsModel.getHoldings();

    // Fetch transactions for each holding
    const holdingsWithTransactions = await Promise.all(
      holdings.map(async (holding) => {
        const transactions = await holdingsModel.getTransactionsByScriptName(holding.scriptName);
        
        return {
          ...holding,
          transactions,
        };
      })
    );

    res.status(200).json(holdingsWithTransactions); // Send the holdings data with transactions as a JSON response
  } catch (error) {
    console.error('Error in getHoldingsWithTransactions controller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getHoldingsWithTransactions,
};
