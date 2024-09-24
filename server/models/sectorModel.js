const pool = require("../config/database");

// Function to get aggregated sector data with script name, quantity, avg cost, sector, and parent company
const getSectorHoldings = async () => {
  const query = `
    SELECT 
      s.name AS "scriptName", 
      s.sector AS "sector",
      s.parent_companies AS "parentCompany",
      SUM(t.quantity) AS "totalQuantity",
      SUM(t.market_cost) / NULLIF(SUM(t.quantity), 0) AS "avgHoldingCost"
    FROM transactions t
    JOIN scripts s ON t.script_name = s.name
    GROUP BY s.name, s.sector, s.parent_companies;
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
