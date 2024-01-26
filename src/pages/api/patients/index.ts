// pages/api/patients/index.ts
import { MongoClient, ServerApiVersion } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { uri } from "../../../../db/mongodb";

const dbName = 'medchain';

const fetchPatients = async (res: NextApiResponse) => {
  console.log("Attempting to fetch patients");

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    console.log("Connected to the database, fetching patients");
    const patients = await db.collection("patients").find({}).toArray();
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

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await client.connect();
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
