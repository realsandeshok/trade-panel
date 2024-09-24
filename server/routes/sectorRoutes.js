const express = require("express");
const { getSectorHoldings } = require("../controllers/sectorController");
const router = express.Router();

// Sector endpoint to get all sector holdings
router.get('/', getSectorHoldings);

module.exports = router;
