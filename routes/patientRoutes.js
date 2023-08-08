// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db/database");

//Request Access
router.put("/:patient_id/request", (req, res) => {
  const patient_id = req.params.patient_id;
  const requestor = req.body.requestor;

  db.get(
    `SELECT history FROM patients WHERE patient_id = ?`,
    [patient_id],
    (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query error", details: err.message });
      }

      if (!row) {
        return res
          .status(404)
          .json({ error: `No patient found with ID: ${patient_id}` });
      }

      let history = JSON.parse(row.history || "[]");
      history.unshift(
        `Access requested by ${requestor} on ${new Date().toISOString()}`
      );

      db.run(
        `UPDATE patients SET accessRequests = json_insert(ifnull(accessRequests, '[]'), '$[0]', ?), history = ? WHERE patient_id = ?`,
        [requestor, JSON.stringify(history), patient_id],
        function (err) {
          if (err) {
            return res.status(500).json({
              error:
                "An error occurred while requesting access in the database.",
              details: err.message,
            });
          }
          console.log(`${requestor} just requested ${patient_id}`);
          res.json({
            message: `Access requested by ${requestor} for patient with id: ${patient_id}`,
          });
        }
      );
    }
  );
});

//Cancel Request Access
router.put("/:patient_id/cancel-request", (req, res) => {
  const patient_id = req.params.patient_id;
  const requestor = req.body.requestor;

  db.get(
    `SELECT history, accessRequests FROM patients WHERE patient_id = ?`,
    [patient_id],
    (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query error", details: err.message });
      }

      if (!row) {
        return res
          .status(404)
          .json({ error: `No patient found with ID: ${patient_id}` });
      }

      let accessRequests = JSON.parse(row.accessRequests || "[]");
      accessRequests = accessRequests.filter((item) => item !== requestor);

      let history = JSON.parse(row.history || "[]");
      history.unshift(
        `Access request by ${requestor} cancelled on ${new Date().toISOString()}`
      );

      db.run(
        `UPDATE patients SET accessRequests = ?, history = ? WHERE patient_id = ?`,
        [JSON.stringify(accessRequests), JSON.stringify(history), patient_id],
        function (err) {
          if (err) {
            return res.status(500).json({
              error:
                "An error occurred while cancelling the access request in the database.",
              details: err.message,
            });
          }
          console.log(`${requestor} just unrequested ${patient_id}`);
          res.json({
            message: `Access request by ${requestor} for patient with id: ${patient_id} cancelled`,
          });
        }
      );
    }
  );
});

// Get all patients
router.get("/", (req, res) => {
  console.log("Received GET request for all patients");
  db.all("SELECT * FROM patients", [], (err, rows) => {
    if (err) {
      console.error("Error querying the database: ", err);
      res
        .status(500)
        .json({ error: "An error occurred while querying the database." });
    } else {
      console.log("Successfully fetched all patients");
      res.json(rows);
    }
  });
});

// Get a single patient by patient_id
router.get("/:patient_id", (req, res) => {
  const patient_id = req.params.patient_id;
  db.get(
    "SELECT * FROM patients WHERE patient_id = ?",
    [patient_id],
    (err, row) => {
      if (err) {
        res
          .status(500)
          .json({ error: "An error occurred while querying the database." });
      } else {
        console.log(`Successfully fetched ${patient_id}`);
        res.json(row);
      }
    }
  );
});

//Transfer ownership
router.put("/:id/transfer", (req, res) => {
  const id = req.params.id;
  const newOwner = req.body.newOwner;

  db.run(
    'UPDATE patients SET owner = ?, history = json_insert(history, "$[0]", ?) WHERE patient_id = ?',
    [
      newOwner,
      `Ownership transferred to ${newOwner} on ${new Date().toISOString()}`,
      id,
    ],
    function (err) {
      if (err) {
        res.status(500).json({
          error:
            "An error occurred while updating the ownership in the database.",
        });
      } else {
        res.json({
          message: `Ownership of patient with id: ${id} transferred to ${newOwner}`,
        });
      }
    }
  );
});

//Share a patient
router.put("/:patient_id/accept-request", (req, res) => {
  const patient_id = req.params.patient_id;
  const address = req.body.requestor;
  const files = req.body.files;

  db.get(
    `SELECT history, accessRequests, sharedWith FROM patients WHERE patient_id = ?`,
    [patient_id],
    (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query error", details: err.message });
      }

      if (!row) {
        return res
          .status(404)
          .json({ error: `No patient found with ID: ${patient_id}` });
      }

      let accessRequests = JSON.parse(row.accessRequests || "[]");
      accessRequests = accessRequests.filter((item) => item !== address);

      let sharedWith = JSON.parse(row.sharedWith || "{}");
      sharedWith[address] = files;

      let history = JSON.parse(row.history || "[]");
      history.unshift(
        `Access request by ${address} accepted on ${new Date().toISOString()}`
      );

      db.run(
        `UPDATE patients SET accessRequests = ?, sharedWith = ?, history = ? WHERE patient_id = ?`,
        [
          JSON.stringify(accessRequests),
          JSON.stringify(sharedWith),
          JSON.stringify(history),
          patient_id,
        ],
        function (err) {
          if (err) {
            return res.status(500).json({
              error:
                "An error occurred while accepting the access request in the database.",
              details: err.message,
            });
          }
          console.log(`${address} has been accepted for ${patient_id}`);
          res.json({
            message: `Access request by ${address} for patient with id: ${patient_id} accepted`,
          });
        }
      );
    }
  );
});

//Unshare a patient
router.put("/:id/unshare", (req, res) => {
  const id = req.params.id;
  const address = req.body.address;

  db.get(
    `SELECT history, accessRequests FROM patients WHERE patient_id = ?`,
    [id],
    (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query error", details: err.message });
      }

      if (!row) {
        return res
          .status(404)
          .json({ error: `No patient found with ID: ${id}` });
      }

      let accessRequests = JSON.parse(row.accessRequests || "[]");
      accessRequests = accessRequests.filter((item) => item !== address);

      let history = JSON.parse(row.history || "[]");
      history.unshift(
        `Patient unshared with ${address} on ${new Date().toISOString()}`
      );

      db.run(
        `UPDATE patients SET accessRequests = ?, sharedWith = json_remove(sharedWith, '$.${address}'), history = ? WHERE patient_id = ?`,
        [JSON.stringify(accessRequests), JSON.stringify(history), id],
        function (err) {
          if (err) {
            return res.status(500).json({
              error:
                "An error occurred while unsharing the patient in the database.",
              details: err.message,
            });
          }
          console.log(`Patient with id: ${id} unshared with ${address}`);
          res.json({
            message: `Patient with id: ${id} unshared with ${address}`,
          });
        }
      );
    }
  );
});

//Remove file
router.put("/:id/remove-file", (req, res) => {
  const id = req.params.id;
  const fileName = req.body.fileName;

  // Remove file from 'content' and update sharedWith and history
  db.run(
    `UPDATE patients SET 
            content = json_remove(content, 
                                  json_array_length(content), 
                                  json_array_length(content) - 1), 
            sharedWith = json_each(sharedWith, 
                                   value - json_remove(value, 
                                                       json_array_length(value), 
                                                       json_array_length(value) - 1)), 
            history = json_insert(history, 
                                  "$[0]", ?) 
          WHERE patient_id = ? AND json_extract(content, '$[last].name') = ?`,
    [`File ${fileName} removed on ${new Date().toISOString()}`, id, fileName],
    function (err) {
      if (err) {
        res.status(500).json({
          error:
            "An error occurred while removing the file from the patient record.",
        });
      } else {
        res.json({
          message: `File ${fileName} removed from patient with id: ${id}`,
        });
      }
    }
  );
});

// Update shared files
router.put("/:id/update-shared", (req, res) => {
  const id = req.params.id;
  const { address, files } = req.body;

  db.get(
    `SELECT history, sharedWith FROM patients WHERE patient_id = ?`,
    [id],
    (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query error", details: err.message });
      }

      if (!row) {
        return res
          .status(404)
          .json({ error: `No patient found with ID: ${id}` });
      }

      let sharedWith = JSON.parse(row.sharedWith || "{}");
      sharedWith[address] = files;

      let history = JSON.parse(row.history || "[]");
      history.unshift(
        `Files updated for ${address} on ${new Date().toISOString()}`
      );

      db.run(
        `UPDATE patients SET sharedWith = ?, history = ? WHERE patient_id = ?`,
        [
          JSON.stringify(sharedWith),
          JSON.stringify(history),
          id,
        ],
        function (err) {
          if (err) {
            return res.status(500).json({
              error:
                "An error occurred while updating shared files in the database.",
              details: err.message,
            });
          }
          console.log(`Files updated for ${address} on patient with id: ${id}`);
          res.json({
            message: `Shared files updated for address: ${address} on patient with id: ${id}`,
          });
        }
      );
    }
  );
});


// Add a shared file
router.put("/:patient_id/add-file", (req, res) => {
  const patient_id = req.params.patient_id;
  const file = req.body.file;

  db.get(
    `SELECT history, content FROM patients WHERE patient_id = ?`,
    [patient_id],
    (err, row) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query error", details: err.message });
      }

      if (!row) {
        return res
          .status(404)
          .json({ error: `No patient found with ID: ${patient_id}` });
      }

      let content = JSON.parse(row.content || "[]");
      content.push(file);

      let history = JSON.parse(row.history || "[]");
      history.unshift(
        `File added by ${file.name} on ${new Date().toISOString()}`
      );

      db.run(
        `UPDATE patients SET content = ?, history = ? WHERE patient_id = ?`,
        [JSON.stringify(content), JSON.stringify(history), patient_id],
        function (err) {
          if (err) {
            return res.status(500).json({
              error: "An error occurred while adding the file to the patient record.",
              details: err.message,
            });
          }
          console.log(`File added to patient with id: ${patient_id}`);
          res.json({ message: `File added to patient with id: ${patient_id}` });
        }
      );
    }
  );
});

//Create a patient
router.post("/", (req, res) => {
  const {
    patient_id,
    owner,
    ownerTitle,
    createdDate,
    content,
    sharedWith,
    history,
    accessRequests,
  } = req.body;

  db.run(
    "INSERT INTO patients(patient_id, owner, ownerTitle, createdDate, content, sharedWith, history, accessRequests) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
    [
      patient_id,
      owner,
      ownerTitle,
      createdDate,
      JSON.stringify(content),
      JSON.stringify(sharedWith),
      JSON.stringify(history),
      JSON.stringify(accessRequests),
    ],
    function (err) {
      if (err) {
        res.status(500).json({
          error: "An error occurred while inserting into the database.",
        });
        return;
      }

      // Fetch the newly created patient to return it in the response
      db.get(
        "SELECT * FROM patients WHERE patient_id = ?",
        patient_id,
        (err, row) => {
          if (err) {
            res.status(500).json({
              error: "An error occurred while querying the database.",
            });
            return;
          }

          row.content = JSON.parse(row.content);
          row.sharedWith = JSON.parse(row.sharedWith);
          row.history = JSON.parse(row.history);
          row.accessRequests = JSON.parse(row.accessRequests);

          res.json(row);
        }
      );
    }
  );
});

// Delete a patient
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM patients WHERE id = ?", id, function (err) {
    if (err) {
      res
        .status(500)
        .json({ error: "An error occurred while deleting from the database." });
    } else {
      res.json({ message: `Patient with id: ${id} deleted successfully` });
    }
  });
});

module.exports = router;
