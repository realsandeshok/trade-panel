const pool = require("../config/database");

// module.exports={
//     queryAllSectors: () =>{
//         const result= pool
//             .promise()
//             .query("SELECT * FROM sectors")
//             .then(([result])=> result)
//             .catch((err)=> console.log(err));
//         return result;
//     },
// };

const getAllSectors = async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM sectors')
      return (result.rows);
    } catch (error) {
      throw new Error('Error fetching sectors: ' + error.message);
      
    }

  };

  module.exports = {
    getAllSectors
  };