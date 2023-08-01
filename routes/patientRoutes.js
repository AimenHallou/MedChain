// routes/patientRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../db/database");

//Request Access
router.put("/:patient_id/request", (req, res) => {
  console.log("Inside PUT /:id/request");
  const patient_id = req.params.patient_id;
  const requestor = req.body.requestor;

  db.run(
    `UPDATE patients SET accessRequests = json_insert(ifnull(accessRequests, '[]'), '$[0]', ?), history = json_insert(history, "$[0]", ?) WHERE patient_id = ?`,
    [
      requestor,
      `Access requested by ${requestor} on ${new Date().toISOString()}`,
      patient_id,
    ],
    function (err) {
      if (err) {
        res.status(500).json({
          error: "An error occurred while requesting access in the database.",
        });
      } else {
        res.json({
          message: `Access requested by ${requestor} for patient with id: ${patient_id}`,
        });
      }
    }
  );
});

//Cancel Access Request
router.put("/:patient_id/cancel-request", (req, res) => {
  console.log("Inside PUT /:patient_id/cancel-request");
  const patient_id = req.params.patient_id;
  const requestor = req.body.requestor;

  db.get(
    `SELECT accessRequests FROM patients WHERE patient_id = ?`,
    [patient_id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Database query error", details: err.message });
      }

      let accessRequests = JSON.parse(row.accessRequests || '[]');

      accessRequests = accessRequests.filter(item => item !== requestor);

      db.run(
        `UPDATE patients SET accessRequests = ?, history = json_insert(history, "$[0]", ?) WHERE patient_id = ?`,
        [
          JSON.stringify(accessRequests),
          `Access request by ${requestor} cancelled on ${new Date().toISOString()}`,
          patient_id
        ],
        function (err) {
          if (err) {
            return res.status(500).json({
              error: "An error occurred while cancelling the access request in the database.",
              details: err.message
            });
          }
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
  console.log("WE ARE IN THE SINGLE PATIETN");
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
router.put("/:id/share", (req, res) => {
  const id = req.params.id;
  const { address, files } = req.body;

  db.run(
    `UPDATE patients SET sharedWith = json_set(ifnull(sharedWith, '{}'), '$.${address}', json(?)), history = json_insert(history, "$[0]", ?) WHERE patient_id = ?`,
    [
      JSON.stringify(files),
      `Patient shared with ${address} on ${new Date().toISOString()}`,
      id,
    ],
    function (err) {
      if (err) {
        res.status(500).json({
          error: "An error occurred while sharing the patient in the database.",
        });
      } else {
        res.json({ message: `Patient with id: ${id} shared with ${address}` });
      }
    }
  );
});

//Unshare a patient
router.put("/:id/unshare", (req, res) => {
  const id = req.params.id;
  const address = req.body.address;

  db.run(
    `UPDATE patients SET sharedWith = json_remove(sharedWith, '$.${address}'), history = json_insert(history, "$[0]", ?) WHERE patient_id = ?`,
    [`Patient unshared with ${address} on ${new Date().toISOString()}`, id],
    function (err) {
      if (err) {
        res.status(500).json({
          error:
            "An error occurred while unsharing the patient in the database.",
        });
      } else {
        res.json({
          message: `Patient with id: ${id} unshared with ${address}`,
        });
      }
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

//Update shared files
router.put("/:id/update-shared", (req, res) => {
  const id = req.params.id;
  const { address, files } = req.body;

  // Update sharedWith for a specific address and update history
  db.run(
    `UPDATE patients SET 
            sharedWith = json_set(sharedWith, 
                                  '$.${address}', 
                                  json(?)), 
            history = json_insert(history, 
                                  "$[0]", ?) 
          WHERE patient_id = ?`,
    [
      JSON.stringify(files),
      `Files updated for ${address} on ${new Date().toISOString()}`,
      id,
    ],
    function (err) {
      if (err) {
        res
          .status(500)
          .json({
            error:
              "An error occurred while updating shared files for the patient.",
          });
      } else {
        res.json({
          message: `Shared files updated for address: ${address} on patient with id: ${id}`,
        });
      }
    }
  );
});

//Add a shared file
router.put("/:id/add-file", (req, res) => {
  const id = req.params.id;
  const file = req.body.file;

  // Add file to 'content' and update history
  db.run(
    `UPDATE patients SET 
            content = json_array_append(content, '$', json(?)), 
            history = json_insert(history, 
                                  "$[0]", ?) 
          WHERE patient_id = ?`,
    [
      JSON.stringify(file),
      `New files added on ${new Date().toISOString()}`,
      id,
    ],
    function (err) {
      if (err) {
        res
          .status(500)
          .json({
            error:
              "An error occurred while adding the file to the patient record.",
          });
      } else {
        res.json({ message: `File added to patient with id: ${id}` });
      }
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
