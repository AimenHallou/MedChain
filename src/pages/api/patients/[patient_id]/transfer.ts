// pages/api/patients/[patient_id]/transfer.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../../../db/mongodb";

const dbName = 'medchain';

async function handleTransferOwnership(patient_id, body, res: NextApiResponse) {
  const { newOwner } = body;

  try {
    const db = client.db(dbName);
    const patient = await db.collection("patients").findOne({ patient_id });

    if (!patient) {
      return res.status(404).json({ error: `No patient found with ID: ${patient_id}` });
    }

    let history = patient.history || [];
    history.unshift({
      type: "transfer",
      timestamp: new Date().toISOString(),
      address: newOwner,
    });

    await db.collection("patients").updateOne(
      { patient_id },
      { $set: { owner: newOwner, history } }
    );

    const updatedPatient = await db.collection("patients").findOne({ patient_id });
    res.json({ message: "Ownership successfully transferred", patient: updatedPatient });

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
    handleTransferOwnership(patient_id, req.body, res);
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
