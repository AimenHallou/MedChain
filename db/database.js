// db/database.js
const sqlite3 = require("sqlite3").verbose();

console.log("Initializing database connection...");

const db = new sqlite3.Database(
  "./medchain.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("Database connection error:", err.message);
      return;
    }
    console.log("Connected to the medchain database.");

    db.serialize(() => {
      console.log("Starting database initialization...");

      const tables = {
        users: `
          CREATE TABLE IF NOT EXISTS users(
            address TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            healthcareType TEXT NOT NULL,
            organizationName TEXT NOT NULL,
            notifications TEXT
          )
        `,
        patients: `
          CREATE TABLE IF NOT EXISTS patients(
            patient_id TEXT PRIMARY KEY,
            owner TEXT NOT NULL,
            createdDate TEXT NOT NULL,
            content TEXT,
            sharedWith TEXT,
            history TEXT,
            accessRequests TEXT
          )
        `,
        datasets: `
          CREATE TABLE IF NOT EXISTS datasets(
            dataset_id TEXT PRIMARY KEY,
            description TEXT,
            owner TEXT NOT NULL,
            createdDate TEXT NOT NULL,
            content TEXT,
            sharedWith TEXT,
            history TEXT,
            accessRequests TEXT
          )
        `,
      };

      for (const [tableName, createTableSql] of Object.entries(tables)) {
        console.log(`Checking existence of ${tableName} table...`);

        db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tableName}';`, (err, row) => {
          if (err) {
            console.error(`Error checking ${tableName} table:`, err);
            return;
          }

          if (row) {
            console.log(`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} table already exists.`);
          } else {
            console.log(`Creating ${tableName} table...`);

            db.run(createTableSql, (err) => {
              if (err) {
                console.error(`Error creating ${tableName} table:`, err);
                return;
              }
              console.log(`${tableName.charAt(0).toUpperCase() + tableName.slice(1)} table created successfully.`);
            });
          }
        });
      }
    });
  }
);

module.exports = db;
