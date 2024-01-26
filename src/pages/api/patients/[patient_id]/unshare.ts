// pages/api/patients/[patient_id]/unshare.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../../../db/mongodb";

const dbName = 'medchain';

async function handleUnsharePatient(
  patient_id: string,
  body: any,
  res: NextApiResponse
) {
  const { address } = body;

  try {
    const db = client.db(dbName);
    const patient = await db.collection("patients").findOne({ patient_id });

    if (!patient) {
      return res.status(404).json({ error: `No patient found with ID: ${patient_id}` });
    }

    let accessRequests = patient.accessRequests || [];
    accessRequests = accessRequests.filter(item => item !== address);

    let sharedWith = patient.sharedWith || {};
    delete sharedWith[address];

    let history = patient.history || [];
    history.unshift({
      type: "unshared",
      timestamp: new Date().toISOString(),
      address,
    });

    await db.collection("patients").updateOne(
      { patient_id },
      { $set: { accessRequests, sharedWith, history } }
    );

    const updatedPatient = await db.collection("patients").findOne({ patient_id });
    res.json(updatedPatient);

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
    handleUnsharePatient(patient_id, req.body, res);
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
