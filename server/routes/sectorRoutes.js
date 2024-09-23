const express= require("express")
const {getAllSectors}= require("../controllers/sectorController");
const router= express.Router()


//sector endpoint
router.get('/', getAllSectors);


module.exports = router;
