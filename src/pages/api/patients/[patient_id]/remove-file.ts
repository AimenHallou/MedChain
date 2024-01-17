// pages/api/patients/[patient_id]/remove-file.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../../db/database";

function handleRemoveFile(patient_id: string, body: any, res: NextApiResponse) {
  const { fileName } = body;

  db.run(
    `UPDATE patients SET 
      content = json_remove(content, json_array_length(content) - 1), 
      sharedWith = json_each(sharedWith, value - json_remove(value, json_array_length(value) - 1)), 
      history = json_insert(history, '$[0]', ?) 
     WHERE patient_id = ? AND json_extract(content, '$[last].name') = ?`,
    [
      `File ${fileName} removed on ${new Date().toISOString()}`,
      patient_id,
      fileName,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          error:
            "An error occurred while removing the file from the patient record.",
          details: err.message,
        });
      }

      res.json({
        message: `File ${fileName} removed from patient with id: ${patient_id}`,
      });
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