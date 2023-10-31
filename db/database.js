// db/database.js
const sqlite3 = require("sqlite3").verbose();

// Open a database handle
const db = new sqlite3.Database(
  "./medchain.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
      return;
    }
    console.log("Connected to the medchain database.");

    db.serialize(() => {
      // Users table
      db.run(
        `CREATE TABLE IF NOT EXISTS users(
      address TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      healthcareType TEXT NOT NULL,
      organizationName TEXT NOT NULL,
      notifications TEXT
    )`,
        (err) => {
          if (err) {
            console.log("Error creating users table:", err);
            return;
          }
          console.log("Users table created successfully.");
        }
      );

      // Patients table
      db.run(
        `CREATE TABLE IF NOT EXISTS patients(
      patient_id TEXT PRIMARY KEY,
      owner TEXT NOT NULL,
      ownerTitle TEXT NOT NULL,
      createdDate TEXT NOT NULL,
      content TEXT,
      sharedWith TEXT,
      history TEXT,
      accessRequests TEXT
    )`,
        (err) => {
          if (err) {
            console.log("Error creating patients table:", err);
            return;
          }
          console.log("Patients table created successfully.");
        }
      );

      // Datasets table
      db.run(
        `CREATE TABLE IF NOT EXISTS datasets(
      dataset_id TEXT PRIMARY KEY,
      description TEXT,
      owner TEXT NOT NULL,
      ownerTitle TEXT NOT NULL,
      createdDate TEXT NOT NULL,
      content TEXT,
      sharedWith TEXT,
      history TEXT
      accessRequests TEXT
    )`,
        (err) => {
          if (err) {
            console.log("Error creating datasets table:", err);
            return;
          }
          console.log("Datasets table created successfully.");
        }
      );
    });
  }
);

module.exports = db;
