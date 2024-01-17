// pages/api/users/[address].ts
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../../db/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const address = req.query.address as string;

  if (req.method === 'GET') {
    db.get("SELECT * FROM users WHERE address = ?", [address], (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Database query error", details: err.message });
      }
      if (!row) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(row);
    });
  } else if (req.method === 'PUT') {
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
  } else if (req.method === 'DELETE') {
    db.run("DELETE FROM users WHERE address = ?", [address], (err) => {
      if (err) {
        return res.status(500).json({ error: "Database delete error", details: err.message });
      }
      res.status(200).json({ message: "User deleted successfully" });
    });
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
