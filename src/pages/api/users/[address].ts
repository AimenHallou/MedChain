// pages/api/users/[address].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../db/database';

const getUser = (address: string, res: NextApiResponse) => {
  db.get("SELECT * FROM users WHERE address = ?", [address], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database query error", details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(row);
  });
};

const updateUser = (address: string, req: NextApiRequest, res: NextApiResponse) => {
  const { name, healthcareType, organizationName, notifications } = req.body;
  db.run(
    "UPDATE users SET name = ?, healthcareType = ?, organizationName = ?, notifications = ? WHERE address = ?",
    [name, healthcareType, organizationName, JSON.stringify(notifications), address],
    (err) => {
      if (err) {
        return res.status(500).json({ error: "Database update error", details: err.message });
      }
      res.status(200).json({ message: "User updated successfully" });
    }
  );
};

const deleteUser = (address: string, res: NextApiResponse) => {
  db.run("DELETE FROM users WHERE address = ?", [address], (err) => {
    if (err) {
      return res.status(500).json({ error: "Database delete error", details: err.message });
    }
    res.status(200).json({ message: "User deleted successfully" });
  });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const address = req.query.address as string;

  switch (req.method) {
    case 'GET':
      getUser(address, res);
      break;
    case 'PUT':
      updateUser(address, req, res);
      break;
    case 'DELETE':
      deleteUser(address, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
