// pages/api/users/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../../../db/mongodb";

const dbName = 'medchain';

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const db = client.db(dbName);
    const users = await db.collection("users").find({}).toArray();
    const usersFormatted = users.map(user => ({
      ...user,
      _id: user._id.toString(),
    }));
    res.status(200).json(usersFormatted);
  } catch (err) {
    res.status(500).json({ error: "Database query error", details: err.message });
  }
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, name, healthcareType, organizationName, notifications } = req.body;

  try {
    const db = client.db(dbName);
    const result = await db.collection("users").insertOne({
      address,
      name,
      healthcareType,
      organizationName,
      notifications
    });

    if (result.acknowledged) {
      const newUser = await db.collection("users").findOne({ _id: result.insertedId });
      res.status(201).json(newUser);
    } else {
      throw new Error("Insert operation not acknowledged");
    }
  } catch (err) {
    res.status(500).json({ error: "Error inserting into database", details: err.message });
  }
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.body;

  try {
    const db = client.db(dbName);
    await db.collection("users").deleteOne({ address });
    await db.collection("patients").deleteMany({ owner: address });
    res.status(200).json({ message: `User with address ${address} and all associated patients successfully deleted.` });
  } catch (err) {
    res.status(500).json({ error: "Error in database operation", details: err.message });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      handleGet(req, res);
      break;
    case "POST":
      handlePost(req, res);
      break;
    case "DELETE":
      handleDelete(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
