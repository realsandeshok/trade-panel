const sector= require("../models/sectorModel");

class SectorController {
    async getAllSectors(req, res) {
      try {
        const sectors = await sector.getAllSectors();
        res.json(sectors);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
}

module.exports = new SectorController();

