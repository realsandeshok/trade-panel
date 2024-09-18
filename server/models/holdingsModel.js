const pool = require("../config/database");

// Function to get aggregated holdings data with transactions
const getHoldings = async () => {
  const query = `
    SELECT 
      s.name AS "scriptName", 
      s.sector AS "sector",
      SUM(t.quantity) AS "totalQuantity",
      SUM(t.market_cost) AS "totalPurchaseValue",
      SUM(t.market_cost) / NULLIF(SUM(t.quantity), 0) AS "avgHoldingCost"
    FROM transactions t
    JOIN scripts s ON t.script_name = s.name
    GROUP BY s.name, s.sector;
  `;

  try {
    const result = await pool.query(query);
    return result.rows; // Returns the aggregated data
  } catch (error) {
    throw new Error("Error fetching holdings: " + error.message);
  }
};

// Function to get transactions for a specific script
const getTransactionsByScriptName = async (scriptName) => {
  const query = `
    SELECT 
      a.account_name AS "accountHolder",
      t.purchase_date AS "purchaseDate",
      t.quantity,
      t.market_cost AS "purchaseValue"
    FROM transactions t
    JOIN accounts a ON t.account_id = a.id
    WHERE t.script_name = $1
  `;

  try {
    const result = await pool.query(query, [scriptName]);
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching transactions: " + error.message);
  }
};


module.exports = {
  getHoldings,
  getTransactionsByScriptName,
};
