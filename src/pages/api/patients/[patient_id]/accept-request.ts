// pages/api/patients/[patient_id]/accept-request.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../../../db/mongodb";
import Patient from "../../../../../db/models/Patient";

async function handleAcceptRequest(
  patient_id: string,
  body: any,
  res: NextApiResponse
) {
  const { requestor, files } = body;

  try {
    await dbConnect();
    const patient = await Patient.findOne({ patient_id });

    if (!patient) {
      return res.status(404).json({ error: `No patient found with ID: ${patient_id}` });
    }

    let accessRequests = patient.accessRequests || [];
    accessRequests = accessRequests.filter(item => item !== requestor);

    let sharedWith = patient.sharedWith || {};
    sharedWith[requestor] = files;

    let history = patient.history || [];
    history.unshift({ type: "accepted", timestamp: new Date().toISOString(), requestor });

    patient.accessRequests = accessRequests;
    patient.sharedWith = sharedWith;
    patient.history = history;
    await patient.save();

    res.json({ message: `Access request accepted for patient ${patient_id}` });

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
    handleAcceptRequest(patient_id, req.body, res);
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
