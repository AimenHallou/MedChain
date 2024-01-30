// pages/api/patients/[patient_id]/cancel-request.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../../../db/mongodb";
import Patient from "../../../../../db/models/Patient";

async function handleCancelRequest(
  patient_id: string,
  body: any,
  res: NextApiResponse
) {
  const { requestor } = body;

  try {
    await dbConnect();
    const patient = await Patient.findOne({ patient_id });

    if (!patient) {
      return res.status(404).json({ error: `No patient found with ID: ${patient_id}` });
    }

    patient.accessRequests = patient.accessRequests.filter(req => req !== requestor);
    patient.history.unshift({ type: "cancelled", timestamp: new Date().toISOString(), requestor });

    await patient.save();

    res.json({ message: `Access request cancelled for patient ${patient_id}` });
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
    handleCancelRequest(patient_id, req.body, res);
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
