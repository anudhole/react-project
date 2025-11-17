const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const connectDB = require('./config/db');
require('dotenv').config();

connectDB();

const sampleRoute = require('./routes/sampleRoute');
app.use('/api', sampleRoute);