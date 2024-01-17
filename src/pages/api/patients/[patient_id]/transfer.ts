// pages/api/patients/[patient_id]/transfer.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../../db/database";

function handleTransferOwnership(
  patient_id: string,
  body: any,
  res: NextApiResponse
) {
  const { newOwner } = body;

  db.get(
    `SELECT owner FROM patients WHERE patient_id = ?`,
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

      db.run(
        'UPDATE patients SET owner = ?, history = json_insert(history, "$[0]", ?) WHERE patient_id = ?',
        [
          newOwner,
          `Ownership transferred to ${newOwner} on ${new Date().toISOString()}`,
          patient_id,
        ],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({
              error:
                "An error occurred while updating the ownership in the database.",
              details: updateErr.message,
            });
          }
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