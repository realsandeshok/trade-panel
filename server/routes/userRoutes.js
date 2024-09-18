// routes/userRoutes.js
const express = require('express');
const { getAllUsers, login, signupUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

// Route to get all users
router.get('/users', getAllUsers);

// Route to login
router.post('/login', login);

// Route to signup
router.post('/signup', signupUser);

// Route to delete a user by ID
router.delete('/users/:id', deleteUser);

module.exports = router;
