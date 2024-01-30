// pages/api/users/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../../db/mongodb";
import User from "../../../../db/models/User";

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await dbConnect();
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Database query error", details: err.message });
  }
};

const handlePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address, name, healthcareType, organizationName, notifications } =
    req.body;

  try {
    await dbConnect();
    const newUser = new User({
      address,
      name,
      healthcareType,
      organizationName,
      notifications,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error inserting into database", details: err.message });
  }
};

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.body;

  try {
    await dbConnect();
    await User.deleteOne({ address });
    res
      .status(200)
      .json({ message: `User with address ${address} successfully deleted.` });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error in database operation", details: err.message });
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
}
