// pages/api/patients/[patient_id]/update-shared.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../../db/database";
import { Patient } from "../../../../objects/types";

function handleUpdateSharedFiles(
  patient_id: string,
  body: any,
  res: NextApiResponse
) {
  const { address, files } = body;

  db.get(
    `SELECT history, sharedWith FROM patients WHERE patient_id = ?`,
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

      let sharedWith = JSON.parse(row.sharedWith.toString() || "{}");
      sharedWith[address] = files;
      let history = JSON.parse(row.history.toString() || "[]");
      history.unshift(
        `Files updated for ${address} on ${new Date().toISOString()}`
      );

      db.run(
        `UPDATE patients SET sharedWith = ?, history = ? WHERE patient_id = ?`,
        [JSON.stringify(sharedWith), JSON.stringify(history), patient_id],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({
              error:
                "An error occurred while updating shared files in the database.",
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
    handleUpdateSharedFiles(patient_id, req.body, res);
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
