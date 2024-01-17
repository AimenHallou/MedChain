// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const { initializeHelia } = require('./src/utils/initHelia');
const db = require('./db/database');

// Import routes
// const userRoutes = require('./routes/userRoutes');
// const patientRoutes = require('./routes/patientRoutes');
const datasetRoutes = require('./routes/datasetRoutes');
const blockchainRoutes = require('./routes/blockchainRoutes');

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(cors({ origin: "http://localhost:3000" }));

// Use Routes
// app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/blockchain', blockchainRoutes);

// Check if the database is operational
app.get('/api/checkDatabase', (req, res) => {
  db.get("SELECT name FROM sqlite_master WHERE type='table';", (err, row) => {
    if (err) {
      console.error('Error checking database:', err);
      res.status(500).json({ message: 'Database check failed', error: err.message });
    } else {
      res.json({ message: 'Database is operational', table: row ? row.name : 'No tables found' });
    }
  });
});

let heliaInstance;

initializeHelia().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

