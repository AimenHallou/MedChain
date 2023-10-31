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

// Share a dataset with a given address
router.put("/:datasetId/share", (req, res) => {
  const { address, files } = req.body;

  const sharedWithEntry = { address, files };

  db.get(`SELECT sharedWith FROM datasets WHERE dataset_id = ?`, [req.params.datasetId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const sharedWith = JSON.parse(row.sharedWith || "[]");
    sharedWith.push(sharedWithEntry);
    const sharedWithJSON = JSON.stringify(sharedWith);

    db.run(`UPDATE datasets SET sharedWith = ? WHERE dataset_id = ?`, [sharedWithJSON, req.params.datasetId], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: `Dataset shared with address: ${address}` });
    });
  });
});

// Unshare a dataset with a given address
router.put("/:datasetId/unshare", (req, res) => {
  const { address } = req.body;

  db.get(`SELECT sharedWith FROM datasets WHERE dataset_id = ?`, [req.params.datasetId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const sharedWith = JSON.parse(row.sharedWith || "[]");
    const updatedSharedWith = sharedWith.filter(item => item.address !== address);
    const sharedWithJSON = JSON.stringify(updatedSharedWith);

    db.run(`UPDATE datasets SET sharedWith = ? WHERE dataset_id = ?`, [sharedWithJSON, req.params.datasetId], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: `Dataset unshared with address: ${address}` });
    });
  });
});

// Request access to a dataset
router.put("/:datasetId/request-access", (req, res) => {
  const { requestor } = req.body;

  const request = { requestor };

  db.get(`SELECT accessRequests FROM datasets WHERE dataset_id = ?`, [req.params.datasetId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const accessRequests = JSON.parse(row.accessRequests || "[]");
    accessRequests.push(request);
    const accessRequestsJSON = JSON.stringify(accessRequests);

    db.run(`UPDATE datasets SET accessRequests = ? WHERE dataset_id = ?`, [accessRequestsJSON, req.params.datasetId], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: `Access request made by: ${requestor}` });
    });
  });
});

// Accept access request for a dataset
router.put("/:datasetId/accept-request", (req, res) => {
  const { requestor, files } = req.body;

  db.get(`SELECT accessRequests, sharedWith FROM datasets WHERE dataset_id = ?`, [req.params.datasetId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const accessRequests = JSON.parse(row.accessRequests || "[]");
    const sharedWith = JSON.parse(row.sharedWith || "[]");

    const updatedAccessRequests = accessRequests.filter(item => item.requestor !== requestor);
    sharedWith.push({ address: requestor, files });

    db.run(`UPDATE datasets SET accessRequests = ?, sharedWith = ? WHERE dataset_id = ?`,
      [JSON.stringify(updatedAccessRequests), JSON.stringify(sharedWith), req.params.datasetId], 
      (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: `Access request accepted for: ${requestor}` });
      }
    );
  });
});

// Reject access request for a dataset
router.put("/:datasetId/reject-request", (req, res) => {
  const { requestor } = req.body;

  db.get(`SELECT accessRequests FROM datasets WHERE dataset_id = ?`, [req.params.datasetId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const accessRequests = JSON.parse(row.accessRequests || "[]");
    const updatedAccessRequests = accessRequests.filter(item => item.requestor !== requestor);

    db.run(`UPDATE datasets SET accessRequests = ? WHERE dataset_id = ?`, [JSON.stringify(updatedAccessRequests), req.params.datasetId], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: `Access request rejected for: ${requestor}` });
    });
  });
});

// Cancel access request to a dataset
router.put("/:datasetId/cancel-request", (req, res) => {
  const { requestor } = req.body;

  db.get(`SELECT accessRequests FROM datasets WHERE dataset_id = ?`, [req.params.datasetId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const accessRequests = JSON.parse(row.accessRequests || "[]");
    const updatedAccessRequests = accessRequests.filter(item => item.requestor !== requestor);

    db.run(`UPDATE datasets SET accessRequests = ? WHERE dataset_id = ?`, [JSON.stringify(updatedAccessRequests), req.params.datasetId], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: `Access request cancelled by: ${requestor}` });
    });
  });
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
