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
// Function to add or update a transaction (including sell)
const addTransaction = async (req, res) => {
    console.log(req.body);


    const {
        script_name,
        quantity,
        account_id,
        type, // "buy" or "sell"
        market_cost, // For buying
        purchase_date, // For buying
        brokerage, // For buying
        sell_market_cost, // For selling
        final_sell_value, // For selling
        profit_loss, // For selling
        sell_date, // For selling
        total_sell_value, // For selling
        purchase_quantity, // For selling
        total_cost, // For selling  
        total_purchase_value // For selling
    } = req.body;

    // Check required fields
    if (!script_name || !quantity || !account_id || !type) {
        return res.status(400).json({ error: 'Script name, quantity, account ID, and type are required' });
    }
    try {
        if (type === 'buy') {
            // Logic for buying shares
            if (!market_cost || !brokerage || !purchase_date) {
                return res.status(400).json({ error: 'Market cost, brokerage, and purchase date are required for buying' });
            }
            const result = await pool.query(
                'INSERT INTO transactions (script_name, quantity, market_cost, brokerage, purchase_date, account_id, type) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [script_name, quantity, market_cost, brokerage, purchase_date, account_id, type]
            );
            return res.status(201).json(result.rows[0]);
        } else if (type === 'sell') {
            // Logic for selling shares
            const result = await pool.query(
                'INSERT INTO transactions (script_name, quantity, market_cost, brokerage, purchase_date, account_id, type, sell_market_cost, final_sell_value,total_sell_value, profit_loss, sell_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *',
                [
                    script_name,
                    quantity,
                    market_cost,         // Ensure this is included
                    brokerage,
                    purchase_date,          // Ensure this is included as purchase_date for the buy
                    account_id,
                    type,
                    sell_market_cost,
                    final_sell_value,
                    total_sell_value,
                    profit_loss,
                    sell_date
                ]
            );
            return res.status(201).json(result.rows[0]);
        }
        else {
            return res.status(400).json({ error: 'Invalid transaction type' });
        }
    } catch (error) {
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
    const { script_name, quantity, market_cost, brokerage, purchase_date, account_id, type } = req.body;

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
    if (type) {
        setClause += `type = $${valueIndex++}, `;
        values.push(type);
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
