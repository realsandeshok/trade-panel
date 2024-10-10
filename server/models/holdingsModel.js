const pool = require("../config/database");

// Function to get aggregated holdings data with transactions
const getHoldings = async () => {
  const query = `
    SELECT 
      s.name AS "scriptName", 
      s.sector AS "sector",
      SUM(CASE WHEN t.type = 'buy' THEN t.quantity ELSE -t.quantity END) AS "totalQuantity",
      SUM(t.market_cost * t.quantity) AS "totalPurchaseValue",
      SUM(t.market_cost) / NULLIF(SUM(CASE WHEN t.type = 'buy' THEN t.quantity ELSE -t.quantity END), 0) AS "avgHoldingCost"
    FROM transactions t
    JOIN scripts s ON t.script_name = s.name
    GROUP BY s.name, s.sector
    HAVING SUM(CASE WHEN t.type = 'buy' THEN t.quantity ELSE -t.quantity END) > 0;
  `;

  try {
    const result = await pool.query(query);
    return result.rows; // Returns the aggregated data
  } catch (error) {
    throw new Error("Error fetching holdings: " + error.message);
  }
};

// Update Holdings when sold
const updateHolding = async (scriptName, quantity) => {
  const query = `
    UPDATE transactions
    SET quantity = quantity - $1
    WHERE script_name = $2 AND type = 'buy';
  `;
  try {
    const result = await pool.query(query, [quantity, scriptName]);
    const updatedQuantity = result.rows[0].quantity;
    if (updatedQuantity === 0) {
      await deleteHolding(scriptName);
    }
    return result.rows;
  } catch (error) {
    throw new Error("Error updating holding: " + error.message);
  }
};

// Function to get transactions for a specific script
const getTransactionsByScriptName = async (scriptName) => {
  const query = `
   SELECT 
  a.account_name AS "accountHolder",
  t.purchase_date AS "purchaseDate",
  t.quantity,
  t.market_cost AS "eachPrice", 
  t.market_cost * t.quantity AS "purchaseValue",
  t.type AS "transactionType"
FROM transactions t
JOIN accounts a ON t.account_id = a.id
WHERE t.script_name = $1  
  `;
  // AND t.type = 'buy';
  try {
    const result = await pool.query(query, [scriptName]);
    return result.rows;
  } catch (error) {
    throw new Error("Error fetching transactions: " + error.message);
  }
};

// Delete Holding if All Quantity of script sold
const deleteHolding = async (scriptName) => {
  const query = `
    DELETE FROM transactions
    WHERE script_name = $1 AND type = 'buy' AND quantity = 0;
  `;
  try {
    const result = await pool.query(query, [scriptName]);
    return result.rows;
  } catch (error) {
    throw new Error("Error deleting holding: " + error.message);
  }
};

module.exports = {
  getHoldings,
  updateHolding,
  deleteHolding,
  getTransactionsByScriptName,
};
