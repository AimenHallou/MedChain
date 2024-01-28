// pages/api/patients/[patient_id]/add-file.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../../../db/mongodb";
import Patient from "../../../../../db/models/Patient";

async function handleAddFile(patient_id: string, body: any, res: NextApiResponse) {
  const { file } = body;

  try {
    await dbConnect(); 
    const patient = await Patient.findOne({ patient_id }); 

    if (!patient) {
      return res.status(404).json({ error: `No patient found with ID: ${patient_id}` });
    }

    patient.content = patient.content || [];
    patient.content.push(file);

    patient.history = patient.history || [];
    patient.history.unshift({ type: "added", timestamp: new Date().toISOString() });

    await patient.save();

    res.json({ message: `File added to patient with id: ${patient_id}` });
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
    handleAddFile(patient_id, req.body, res);
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
