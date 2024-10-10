const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const scriptController = require("../controllers/scriptController");

// Setup multer for file uploads
// const multer = require('multer');

// Setup multer for file uploads with disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

const upload = multer({
  storage: storage
});

// Route to get all scripts
router.get("/", scriptController.getScripts);

// Route to add a new script
router.post("/", scriptController.addScript);

// Route to delete a script by id
router.delete("/:id", scriptController.deleteScript);

// Route to update a script by id
router.patch("/:id", scriptController.updateScript);

// Route to import csv file
router.post('/uploadcsv', upload.single('file'), scriptController.uploadCsv);

module.exports = router;
