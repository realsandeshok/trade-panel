// controllers/accountController.js
const pool = require('../config/database');

const getAccounts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM accounts');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const addAccount = async (req, res) => {
    const { account_name, broker_id, broker, client_code, brokerage_percentage } = req.body;

    if (!account_name || !broker_id || !broker || !client_code || !brokerage_percentage) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO accounts (account_name, broker_id, broker, client_code, brokerage_percentage) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [account_name, broker_id, broker, client_code, brokerage_percentage]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        // Check for unique constraint violation error
        if (error.code === '23505') { // PostgreSQL unique violation error code
            return res.status(409).json({ error: 'Account with this name or broker ID already exists' });
        }
        console.error('Error adding account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const deleteAccount = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Account ID is required' });
    }

    try {
        const result = await pool.query('DELETE FROM accounts WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
const updateAccount = async (req, res) => {
    const { id } = req.params;
    const { account_name, broker_id, broker, client_code, brokerage_percentage } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'Account ID is required' });
    }

    // Construct the SET clause dynamically based on provided fields
    let setClause = '';
    const values = [];
    let valueIndex = 1;

    if (account_name) {
        setClause += `account_name = $${valueIndex++}, `;
        values.push(account_name);
    }
    if (broker_id) {
        setClause += `broker_id = $${valueIndex++}, `;
        values.push(broker_id);
    }
    if (broker) {
        setClause += `broker = $${valueIndex++}, `;
        values.push(broker);
    }
    if (client_code) {
        setClause += `client_code = $${valueIndex++}, `;
        values.push(client_code);
    }
    if (brokerage_percentage) {
        setClause += `brokerage_percentage = $${valueIndex++}, `;
        values.push(brokerage_percentage);
    }

    if (setClause === '') {
        return res.status(400).json({ error: 'No fields to update' });
    }

    // Remove trailing comma and space
    setClause = setClause.slice(0, -2);
    values.push(id);

    try {
        const result = await pool.query(
            `UPDATE accounts SET ${setClause} WHERE id = $${valueIndex} RETURNING *`,
            values
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAccounts,
    addAccount,
    deleteAccount,
    updateAccount
};
