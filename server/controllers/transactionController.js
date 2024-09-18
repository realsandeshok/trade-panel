const pool = require('../config/database');

// Function to get all transactions from the database
const getTransactions = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.*, a.account_name
            FROM transactions t
            JOIN accounts a ON t.account_id = a.id
        `);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to add a new transaction
const addTransaction = async (req, res) => {
    const { script_name, quantity, market_cost, brokerage, purchase_date, account_id } = req.body;

    if (!script_name || !quantity || !market_cost || !brokerage || !purchase_date || !account_id) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO transactions (script_name, quantity, market_cost, brokerage, purchase_date, account_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [script_name, quantity, market_cost, brokerage, purchase_date, account_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { // PostgreSQL unique violation error code
            return res.status(409).json({ error: 'Transaction with these details already exists' });
        }
        console.error('Error adding transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to delete a transaction
const deleteTransaction = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Transaction ID is required' });
    }

    try {
        const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to update a transaction
const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { script_name, quantity, market_cost, brokerage, purchase_date, account_id } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Transaction ID is required' });
    }

    // Construct the SET clause dynamically based on provided fields
    let setClause = '';
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
    if (account_id) {
        setClause += `account_id = $${valueIndex++}, `;
        values.push(account_id);
    }

    if (setClause === '') {
        return res.status(400).json({ error: 'No fields to update' });
    }

    // Remove trailing comma and space
    setClause = setClause.slice(0, -2);
    values.push(id);

    try {
        const result = await pool.query(
            `UPDATE transactions SET ${setClause} WHERE id = $${valueIndex} RETURNING *`,
            values
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction
};
