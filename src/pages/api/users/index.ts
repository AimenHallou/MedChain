// pages/api/users/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../db/database";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    db.all("SELECT * FROM users", [], (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query error", details: err.message });
      }
      res.status(200).json(rows);
    });
  } else if (req.method === "POST") {
    const { address, name, healthcareType, organizationName, notifications } =
      req.body;

    db.run(
      "INSERT INTO users (address, name, healthcareType, organizationName, notifications) VALUES (?, ?, ?, ?, ?)",
      [address, name, healthcareType, organizationName],
      function (err) {
        if (err) {
          return res.status(500).json({
            error: "An error occurred while inserting into the database.",
            details: err.message,
          });
        }

        db.get(
          "SELECT * FROM users WHERE address = ?",
          [address],
          (err, row) => {
            if (err) {
              return res
                .status(500)
                .json({ error: "Database query error", details: err.message });
            }

            res.status(201).json(row);
          }
        );
      }
    );
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
