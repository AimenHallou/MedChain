// pages/api/patients/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../../db/mongodb";
import { Patient } from "../../../objects/types";

const dbName = 'medchain';

const fetchPatients = async (res: NextApiResponse) => {
  try {
    const db = client.db(dbName);
    const patients = await db.collection("patients").find({}).toArray();
    res.status(200).json(patients);
  } catch (err) {
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
    const db = client.db(dbName);
    const result = await db.collection("patients").insertOne({
      patient_id,
      owner,
      createdDate,
      content,
      sharedWith,
      history: history ? JSON.stringify(history) : "[]", // Assuming history is an array
      accessRequests,
    });

    if (result.acknowledged) {
      const newPatient = await db.collection("patients").findOne({ _id: result.insertedId });
      res.status(201).json(newPatient);
    } else {
      throw new Error("Insert operation not acknowledged");
    }
  } catch (err) {
    res.status(500).json({ error: "Error inserting into database", details: err.message });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      fetchPatients(res);
      break;
    case "POST":
      handleCreatePatient(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
