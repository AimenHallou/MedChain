// pages/api/patients/[patient_id]/transfer.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../../db/database";
import { Patient } from "../../../../objects/types";

function handleTransferOwnership(patient_id, body, res) {
  console.log("We are in the transfer ownership handler");
  const { newOwner } = body;

  db.get(
    `SELECT history, owner FROM patients WHERE patient_id = ?`,
    [patient_id],
    (err, row: Patient | undefined) => {
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

      let history = JSON.parse(row.history.toString());
      history.unshift({
        type: "transfer",
        timestamp: new Date().toISOString(),
        address: newOwner,
      });

      db.run(
        "UPDATE patients SET owner = ?, history = ? WHERE patient_id = ?",
        [newOwner, JSON.stringify(history), patient_id],
        (err) => {
          if (err) {
            return res
              .status(500)
              .json({ error: "Database query error", details: err.message });
          }

          res.json({ message: "Ownership successfully transferred" });
        }
      );
      db.get(
        "SELECT * FROM patients WHERE patient_id = ?",
        [patient_id],
        (err, updatedRow) => {
          if (err) {
            return res.status(500).json({
              error: "Failed to fetch updated patient data",
              details: err.message,
            });
          }
          res.json(updatedRow);
        }
      );
    }
  );
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { patient_id } = req.query;

  if (typeof patient_id !== "string") {
    return res.status(400).json({ error: "Invalid patient ID" });
  }

  if (req.method === "PUT") {
    handleTransferOwnership(patient_id, req.body, res);
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
