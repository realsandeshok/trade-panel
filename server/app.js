const express = require('express');
const cors = require('cors'); // Import the cors package
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const scriptRoutes = require('./routes/scriptRoutes');
const transactionRoutes = require('./routes/transactionsRoutes');
const holdingsRoutes = require('./routes/holdingsRoutes')
const sectorRoutes = require('./routes/sectorRoutes')
 
const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors()); // This will allow all origins. You can configure it more specifically if needed.

app.use(express.json());
app.use('/api', userRoutes);
// app.use('/ac', accountRoutes)
app.use('/accounts', accountRoutes);;
app.use('/scripts', scriptRoutes); // Add route for scripts
// app.use('/transaction',transRoutes)
app.use('/holdings', holdingsRoutes)
app.use('/transactions', transactionRoutes)
app.use('/sectors', sectorRoutes)


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
