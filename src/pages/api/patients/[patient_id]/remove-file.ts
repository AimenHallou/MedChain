// pages/api/patients/[patient_id]/remove-file.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../../../db/mongodb";
import Patient from "../../../../../db/models/Patient";

async function handleRemoveFile(
  patient_id: string,
  body: any,
  res: NextApiResponse
) {
  const { ipfsCID } = body;

  try {
    await dbConnect();

    const patient = await Patient.findOneAndUpdate(
      { patient_id },
      {
        $pull: { content: { ipfsCID } },
        $push: {
          history: {
            type: "removed",
            timestamp: new Date().toISOString(),
            ipfsCID,
          },
        },
      },
      { new: true }
    );

    if (!patient) {
      return res
        .status(404)
        .json({ error: `No patient found with ID: ${patient_id}` });
    }

    res.json({
      message: `File ${ipfsCID} removed from patient with id: ${patient_id}`,
    });
  } catch (err) {
    console.error("Error in database operation", err);
    res
      .status(500)
      .json({ error: "Database operation error", details: err.message });
  }
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
