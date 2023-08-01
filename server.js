// server.js
const express = require('express');
const app = express();
const port = 3001;

// Import routes
const userRoutes = require('./routes/userRoutes');
const patientRoutes = require('./routes/patientRoutes');

// Middleware
app.use(express.json({ limit: '50mb' }));

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});
