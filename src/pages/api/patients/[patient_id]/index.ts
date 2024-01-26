// pages/api/patients/[patient_id]/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../../../db/mongodb";
import { ObjectId } from 'mongodb';

const dbName = 'medchain';

async function fetchPatient(patient_id: string, res: NextApiResponse) {
  try {
    const db = client.db(dbName);
    const patient = await db.collection("patients").findOne({ patient_id });

    if (!patient) {
      return res
        .status(404)
        .json({ error: `No patient found with ID: ${patient_id}` });
    }
    res.status(200).json(patient);
  } catch (err) {
    res.status(500).json({ error: "Database query error", details: err.message });
  }
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
