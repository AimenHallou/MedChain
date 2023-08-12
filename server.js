// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Import routes
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');
const blockchainRoutes = require('./routes/blockchainRoutes');

// Middleware
app.use(express.json({ limit: '50mb' }));

app.use(cors({
  origin: "http://localhost:3000"
}));

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/blockchain', blockchainRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});
