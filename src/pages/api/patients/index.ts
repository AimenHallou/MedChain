// pages/api/patients/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../../db/mongodb";
import Patient from "../../../../db/models/Patient";

const fetchPatients = async (res: NextApiResponse) => {
  console.log("Attempting to fetch patients");

  try {
    await dbConnect();
    console.log("Connected to the database");

    console.time("FetchPatientsTime");
    const patients = await Patient.find({});
    console.timeEnd("FetchPatientsTime");
    console.log("Patients fetched successfully");

    res.status(200).json(patients);
  } catch (err) {
    console.error("Error while fetching patients:", err);
    res.status(500).json({ error: "Database query error", details: err.message });
  }
};

const handleCreatePatient = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    patient_id,
    owner,
    createdDate,
    content,
    sharedWith,
    history,
    accessRequests,
  } = req.body;

  try {
    await dbConnect();

    const newPatient = new Patient({
      patient_id,
      owner,
      createdDate,
      content,
      sharedWith,
      history,
      accessRequests,
    });

    const result = await newPatient.save();

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error inserting into database", details: err.message });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`Received request: ${req.method}`);
  switch (req.method) {
    case "GET":
      fetchPatients(res);
      break;
    case "POST":
      handleCreatePatient(req, res);
      break;
    default:
      console.log(`Method not allowed: ${req.method}`);
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
