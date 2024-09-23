const pool = require("../config/database");

// Function to get aggregated sector data with script name, quantity, avg cost, sector, and parent company
const getSectorHoldings = async () => {
  const query = `
  SELECT 
  a.account_name AS "accountHolder",
  t.purchase_date AS "purchaseDate",
  t.quantity,
  t.market_cost * t.quantity AS "purchaseValue",  
  AVG(t.market_cost) OVER (PARTITION BY t.script_name) AS "avgHoldingCost" 
FROM transactions t
JOIN accounts a ON t.account_id = a.id
WHERE t.script_name = $1;
  `;

  try {
    const result = await pool.query(query);
    return result.rows; // Returns the aggregated data
  } catch (error) {
    throw new Error("Error fetching sector holdings: " + error.message);
  }
};

module.exports = {
  getSectorHoldings,
};
