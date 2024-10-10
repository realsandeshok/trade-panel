const pool = require("../config/database");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");

// Function to add a new script
const addScript = async (req, res) => {
  const { name, sector, parent_companies, referred, portfolio } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO scripts (name, sector, parent_companies, referred, portfolio) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, sector, parent_companies, referred, portfolio]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === "23505") {
      res.status(400).json({ error: "Script name already exists" });
    } else {
      console.error("Error adding script:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// Function to get all scripts
const getScripts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM scripts ORDER BY id DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching scripts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to delete a script
const deleteScript = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "DELETE FROM scripts WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Script not found" });
    }

    res.status(200).json({ message: "Script deleted successfully" });
  } catch (error) {
    console.error("Error deleting script:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to update a script
const updateScript = async (req, res) => {
  const { id } = req.params;
  const { name, sector, parent_companies, referred, portfolio } = req.body;

  try {
    const result = await pool.query(
      "UPDATE scripts SET name = $1, sector = $2, parent_companies = $3, referred = $4, portfolio = $5 WHERE id = $6 RETURNING *",
      [name, sector, parent_companies, referred, portfolio, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Script not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating script:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Function to handle CSV upload and processing
const uploadCsv = async (req, res) => {
  console.log(req.file); // Log the uploaded file information
  const file = req.file;

  // Check if file is uploaded
  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const uploadsDir = path.join(__dirname, "uploads"); // Get the uploads directory path

  // Check if uploads directory exists, create if it doesn't
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Create the uploads directory
  }

  // Ensure the file path is correct before reading
  const filePath = path.join(uploadsDir, file.filename); // Use path.join to create the correct file path

  // Move the uploaded file to the correct path
  fs.rename(file.path, filePath, (err) => {
    if (err) {
      console.error("Error moving the uploaded file:", err);
      return res.status(500).json({ error: "Error moving the uploaded file" });
    }

    const results = []; // Array to store parsed CSV data

    // Read and parse the CSV file
    fs.createReadStream(filePath) // Use the new file path
      .pipe(csv())
      .on("data", (data) => results.push(data)) // Push each row to results
      .on("end", async () => {
        // console.log("Parsed CSV Results:", results);
        const validColumns = [
          "name",
          "sector",
          "parentcompanies",
          "referred",
          "portfolio",
        ];

        const normalizeColumnName = (columnName) => {
          return columnName.toLowerCase().replace(/\s+/g, "").toLowerCase(); // Remove spaces and underscores
        };

        const csvColumns = Object.keys(results[0]);
        const normalizedCsvColumns = csvColumns.map(normalizeColumnName);
        // console.log("Normalized CSV Columns:", normalizedCsvColumns);

        // Compare CSV columns to validColumns
        let isValid = true;
        normalizedCsvColumns.forEach((col) => {
          if (!validColumns.includes(col)) {
            console.log(`Invalid column: ${col}`);
            isValid = false;
          }
        });

        if (!isValid) {
          return res.status(400).json({ error: "Invalid CSV columns" });
        }

        // Prepare batch insert array and collect duplicates
        const insertPromises = [];
        const duplicateNames = new Set();

        for (const row of results) {
          const normalizedRow = Object.keys(row).reduce((acc, key) => {
            const normalizedKey = normalizeColumnName(key);
            acc[normalizedKey] = row[key];
            return acc;
          }, {});
          // console.log("Row:", normalizedRow);
          const { name, sector, parentcompanies, portfolio, referred } =
            normalizedRow;

          // Check if the name is defined
          if (!name) {
            console.log(
              "Skipping row due to missing 'name' field:",
              normalizedRow
            );
            continue; // Skip this iteration if name is missing
          }

          // Check if the scriptName already exists
          const duplicateCheck = await pool.query(
            "SELECT * FROM scripts WHERE name = $1",
            [name]
          );

          if (duplicateCheck.rows.length === 0) {
            // If no duplicate, prepare the insert query
            insertPromises.push(
              pool.query(
                "INSERT INTO scripts (name, sector, parent_companies, referred, portfolio) VALUES ($1, $2, $3, $4, $5)",
                [name, sector, parentcompanies, referred, portfolio]
              )
            );
          } else {
            // Add the duplicate script name to the set for logging later
            duplicateNames.add(name);
          }
        }

        // Execute all insert queries
        await Promise.all(insertPromises);

        // Prepare success message including any duplicates found
        const responseMessage = {
          message: "CSV data uploaded and processed successfully",
          duplicates: Array.from(duplicateNames),
        };

        res.json(responseMessage); // Send success response
      });
  });
};

module.exports = {
  addScript,
  getScripts,
  deleteScript,
  updateScript,
  uploadCsv,
};
