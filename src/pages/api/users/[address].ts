// pages/api/users/[address].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "../../../../db/mongodb";
import User from "../../../../db/models/User";

const getUser = async (address: string, res: NextApiResponse) => {
  try {
    await dbConnect();
    const user = await User.findOne({ address });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Database query error", details: err.message });
  }
};

const updateUser = async (
  address: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { name, healthcareType, organizationName, notifications } = req.body;

  try {
    await dbConnect();
    await User.updateOne(
      { address },
      { $set: { name, healthcareType, organizationName, notifications } }
    );
    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Database update error", details: err.message });
  }
};

const deleteUser = async (address: string, res: NextApiResponse) => {
  try {
    await dbConnect();
    await User.deleteOne({ address });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Database delete error", details: err.message });
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const address = req.query.address as string;

  switch (req.method) {
    case "GET":
      getUser(address, res);
      break;
    case "PUT":
      updateUser(address, req, res);
      break;
    case "DELETE":
      deleteUser(address, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
