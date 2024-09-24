const pool = require('../config/database');

// Function to add a new script
const addScript = async (req, res) => {
    const { name, sector, parent_companies, referred, portfolio } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO scripts (name, sector, parent_companies, referred, portfolio) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, sector, parent_companies, referred, portfolio]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            res.status(400).json({ error: 'Script name already exists' });
        } else {
            console.error('Error adding script:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
};

// Function to get all scripts
const getScripts = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM scripts');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching scripts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to delete a script
const deleteScript = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            'DELETE FROM scripts WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Script not found' });
        }

        res.status(200).json({ message: 'Script deleted successfully' });
    } catch (error) {
        console.error('Error deleting script:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to update a script
const updateScript = async (req, res) => {
    const { id } = req.params;
    const { name, sector, parent_companies, referred, portfolio } = req.body;

    try {
        const result = await pool.query(
            'UPDATE scripts SET name = $1, sector = $2, parent_companies = $3, referred = $4, portfolio = $5 WHERE id = $6 RETURNING *',
            [name, sector, parent_companies, referred, portfolio, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Script not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating script:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    addScript,
    getScripts,
    deleteScript,
    updateScript
};
