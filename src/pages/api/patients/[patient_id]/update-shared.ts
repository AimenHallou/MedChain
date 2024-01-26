// pages/api/patients/[patient_id]/update-shared.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../../../db/mongodb";

const dbName = 'medchain';

async function handleUpdateSharedFiles(
  patient_id: string,
  body: any,
  res: NextApiResponse
) {
  const { address, files } = body;

  try {
    const db = client.db(dbName);
    const patient = await db.collection("patients").findOne({ patient_id });

    if (!patient) {
      return res.status(404).json({ error: `No patient found with ID: ${patient_id}` });
    }

    let sharedWith = patient.sharedWith || {};
    sharedWith[address] = files;

    let history = patient.history || [];
    history.unshift({ type: "updated", timestamp: new Date().toISOString(), address });

    // Update the database
    await db.collection("patients").updateOne(
      { patient_id },
      { $set: { sharedWith, history } }
    );

    res.json({ message: `Shared files updated for patient with id: ${patient_id}` });

  } catch (err) {
    console.error("Error in database operation", err);
    res.status(500).json({ error: "Database operation error", details: err.message });
  }
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
