// pages/api/patients/[patient_id]/edit-file.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../../../db/mongodb";
import Patient from "../../../../../db/models/Patient";

async function handleEditFile(patient_id: string, body: any, res: NextApiResponse) {
  const { file } = body;

  if (!file || !file.ipfsCID) {
    return res.status(400).json({ error: "Invalid file data" });
  }

  try {
    await dbConnect();
    const patient = await Patient.findOne({ patient_id });

    if (!patient) {
      return res.status(404).json({ error: `No patient found with ID: ${patient_id}` });
    }

    let content = patient.content || [];
    const fileIndex = content.findIndex(f => f.ipfsCID === file.ipfsCID);
    if (fileIndex !== -1) {
      content[fileIndex] = file;
    } else {
      return res.status(404).json({ error: "File not found in patient record" });
    }

    let history = patient.history || [];
    history.unshift({ type: "edited", timestamp: new Date().toISOString(), file });

    patient.content = content;
    patient.history = history;
    await patient.save();

    res.json({ message: `File details updated for patient with id: ${patient_id}` });
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
    handleEditFile(patient_id, req.body, res);
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
