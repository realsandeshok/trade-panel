const sectorModel = require('../models/sectorModel');

// Controller function to handle the API request for fetching sector data with script details
const getSectorHoldings = async (req, res) => {
  try {
    // Fetch aggregated sector data with script name, total quantity, avg holding cost, and parent company
    const sectorHoldings = await sectorModel.getSectorHoldings();

    // Send the sector data as a JSON response
    res.status(200).json(sectorHoldings);
  } catch (error) {
    console.error('Error in getSectorHoldings controller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getSectorHoldings,
};
