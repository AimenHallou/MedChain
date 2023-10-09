// routes/datasetRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db/database");

// Fetch all datasets
router.get("/", (req, res) => {
  db.all("SELECT * FROM datasets", [], (err, rows) => {
    if (err) {
      console.error("Error querying the database: ", err);
      return res
        .status(500)
        .json({ error: "An error occurred while querying the database." });
    } else {
      console.log("Successfully fetched all datasets");
      res.json(rows);
    }
  });
});

// Fetch a single dataset by dataset_id
router.get("/:dataset_id", (req, res) => {
  const dataset_id = req.params.dataset_id;
  db.get(
    "SELECT * FROM datasets WHERE dataset_id = ?",
    [dataset_id],
    (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "An error occurred while querying the database." });
      }
      res.json(row);
    }
  );
});

// Create a new dataset
router.post("/", (req, res) => {
  const {
    dataset_id,
    description,
    owner,
    ownerTitle,
    createdDate,
    content,
    sharedWith,
    history,
  } = req.body;

  const contentJSON = content ? JSON.stringify(content) : null;
  const sharedWithJSON = JSON.stringify(sharedWith);
  console.log("test");

  db.run(
    `INSERT INTO datasets(dataset_id, description, owner, ownerTitle, createdDate, content, sharedWith, history)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      dataset_id,
      description,
      owner,
      ownerTitle,
      createdDate,
      contentJSON,
      sharedWithJSON,
      JSON.stringify(history),
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "An error occurred while inserting into the database.",
          details: err.message,
        });
      }
      res.json({
        message: `Dataset with id: ${dataset_id} created successfully`,
      });
    }
  );
});

// Delete a dataset
router.delete("/:dataset_id", (req, res) => {
  const dataset_id = req.params.dataset_id;
  db.run(
    "DELETE FROM datasets WHERE dataset_id = ?",
    dataset_id,
    function (err) {
      if (err) {
        return res
          .status(500)
          .json({
            error: "An error occurred while deleting from the database.",
          });
      }
      res.json({
        message: `Dataset with id: ${dataset_id} deleted successfully`,
      });
    }
  );
});

module.exports = router;
