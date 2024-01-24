// pages/api/patients/[patient_id]/edit-file.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../../db/database";
import { Patient } from "../../../../objects/types";

function handleEditFile(patient_id: string, body: any, res: NextApiResponse) {
  const { file } = body;

  if (!file || !file.ipfsCID) {
    return res.status(400).json({ error: "Invalid file data" });
  }

  db.get(
    `SELECT history, content FROM patients WHERE patient_id = ?`,
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

      let content = JSON.parse(row.content?.toString() || "[]");
      const fileIndex = content.findIndex((f) => f.ipfsCID === file.ipfsCID);

      if (fileIndex !== -1) {
        content[fileIndex] = file;
      } else {
        return res
          .status(404)
          .json({ error: "File not found in patient record" });
      }

      let history = JSON.parse(row.history?.toString() || "[]");
      history.unshift({
        type: "edited",
        timestamp: new Date().toISOString(),
        file,
      });

      db.run(
        `UPDATE patients SET content = ?, history = ? WHERE patient_id = ?`,
        [JSON.stringify(content), JSON.stringify(history), patient_id],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({
              error:
                "An error occurred while updating the file in the patient record.",
              details: updateErr.message,
            });
          }
          res.json({
            message: `File details updated for patient with id: ${patient_id}`,
          });
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
    handleEditFile(patient_id, req.body, res);
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
