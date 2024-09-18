//models/userModels.js
const pool = require('../config/database');

// Function to get all users from the database
const getAllUsers = async () => {
  try {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};
// Function to get a user by email and password from the database
const getUserByEmailAndPassword = async (email, password) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new Error('Error checking user credentials: ' + error.message);
  }
  
};
// Function to delete a user by ID
const deleteUserById = async (id) => {
  // console.log(id);

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return result;
  } catch (error) {
    throw new Error('Error deleting user: ' + error.message);
  }
};
// Function to get a user by email
const getUserByEmail = async (email) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Error checking user email: ' + error.message);
  }
};
// Function to add a new user to the database
const addUser = async ({ email, password }) => {
  try {
    const result = await pool.query(
      'INSERT INTO users ( email, password) VALUES ($1, $2) RETURNING *',
      [ email, password]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error('Error adding user: ' + error.message);
  }
};
module.exports = {
  getAllUsers,getUserByEmailAndPassword,addUser,getUserByEmail,deleteUserById
};
