// db/database.js
const sqlite3 = require('sqlite3').verbose();

// Open a database handle
const db = new sqlite3.Database('./medchain.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Connected to the medchain database.');

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users(
      address TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      notifications TEXT
    )`, (err) => {
      if (err) {
        console.log('Error creating users table:', err);
        return;
      }
      console.log('Users table created successfully.');
    });

    db.run(`CREATE TABLE IF NOT EXISTS patients(
      patient_id TEXT PRIMARY KEY,
      owner TEXT NOT NULL,
      ownerTitle TEXT NOT NULL,
      createdDate TEXT NOT NULL,
      content TEXT,
      sharedWith TEXT,
      history TEXT,
      accessRequests TEXT
    )`, (err) => {
      if (err) {
        console.log('Error creating patients table:', err);
        return;
      }
      console.log('Patients table created successfully.');
    });
  });
});

module.exports = db;
