// pages/api/patients/[patient_id]/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../../db/database";

function fetchPatient(patient_id: string, res: NextApiResponse) {
   db.get(
    "SELECT * FROM patients WHERE patient_id = ?",
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
      res.status(200).json(row);
    }
  );
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { patient_id } = req.query;

  if (typeof patient_id !== "string") {
    return res.status(400).json({ error: "Invalid patient ID" });
  }

  switch (req.method) {
    case "GET":
      fetchPatient(patient_id, res);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
