const pool = require("../config/database");

const getAllTransactions = async () => {
  const result = await pool.query(`
        SELECT t.*, a.account_name
FROM transactions t
JOIN accounts a ON t.account_holder = a.id
    `);
  return result.rows;
};

const getTransactionById = async (id) => {
  const result = await pool.query(
    `
        SELECT t.*, a.account_name
        FROM transactions t
        JOIN accounts a ON t.account_holder = a.id
        WHERE t.id = $1
    `,
    [id]
  );
  return result.rows[0];
};

const createTransaction = async (transaction) => {
  const {
    script_name,
    quantity,
    market_cost,
    brokerage,
    purchase_date,
    account_holder,
  } = transaction;
  const result = await pool.query(
    "INSERT INTO transactions (script_name, quantity, market_cost, brokerage, purchase_date, account_holder) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [
      script_name,
      quantity,
      market_cost,
      brokerage,
      purchase_date,
      account_holder,
    ]
  );
  return result.rows[0];
};

const updateTransaction = async (id, transaction) => {
  const {
    script_name,
    quantity,
    market_cost,
    brokerage,
    purchase_date,
    account_holder,
  } = transaction;
  let setClause = "";
  const values = [];
  let valueIndex = 1;

  if (script_name) {
    setClause += `script_name = $${valueIndex++}, `;
    values.push(script_name);
  }
  if (quantity) {
    setClause += `quantity = $${valueIndex++}, `;
    values.push(quantity);
  }
  if (market_cost) {
    setClause += `market_cost = $${valueIndex++}, `;
    values.push(market_cost);
  }
  if (brokerage) {
    setClause += `brokerage = $${valueIndex++}, `;
    values.push(brokerage);
  }
  if (purchase_date) {
    setClause += `purchase_date = $${valueIndex++}, `;
    values.push(purchase_date);
  }
  if (account_holder) {
    setClause += `account_holder = $${valueIndex++}, `;
    values.push(account_holder);
  }

  if (setClause === "") {
    throw new Error("No fields to update");
  }

  setClause = setClause.slice(0, -2);
  values.push(id);

  const result = await pool.query(
    `UPDATE transactions SET ${setClause} WHERE id = $${valueIndex} RETURNING *`,
    values
  );
  return result.rows[0];
};

const deleteTransaction = async (id) => {
  const result = await pool.query(
    "DELETE FROM transactions WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
