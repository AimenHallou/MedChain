// pages/api/patients/[patient_id]/remove-file.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../../db/database";
import { Patient } from "../../../../objects/types";

function handleRemoveFile(patient_id: string, body: any, res: NextApiResponse) {
  const { ipfsCID } = body;

  db.get(
    `SELECT history, content FROM patients WHERE patient_id = ?`,
    [patient_id],
    (err, row: Patient | undefined) => {
      if (err) {
        return res.status(500).json({ error: "Database query error", details: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: `No patient found with ID: ${patient_id}` });
      }

      let content = JSON.parse(row.content?.toString() || "[]");
      content = content.filter(file => file.ipfsCID !== ipfsCID);
      let history = JSON.parse(row.history?.toString() || "[]");
      history.unshift({ type: "removed", timestamp: new Date().toISOString(), ipfsCID });

      db.run(
        `UPDATE patients SET content = ?, history = ? WHERE patient_id = ?`,
        [JSON.stringify(content), JSON.stringify(history), patient_id],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({
              error: "An error occurred while removing the file from the patient record.",
              details: updateErr.message,
            });
          }
          res.json({ message: `File ${ipfsCID} removed from patient with id: ${patient_id}` });
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
    handleRemoveFile(patient_id, req.body, res);
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
