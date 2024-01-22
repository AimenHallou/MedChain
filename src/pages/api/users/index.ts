// pages/api/users/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../db/database";

const handleGet = (req: NextApiRequest, res: NextApiResponse) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database query error", details: err.message });
    }
    res.status(200).json(rows);
  });
};

const handlePost = (req: NextApiRequest, res: NextApiResponse) => {
  const { address, name, healthcareType, organizationName, notifications } =
    req.body;

  db.run(
    "INSERT INTO users (address, name, healthcareType, organizationName, notifications) VALUES (?, ?, ?, ?, ?)",
    [
      address,
      name,
      healthcareType,
      organizationName,
      JSON.stringify(notifications),
    ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: "An error occurred while inserting into the database.",
          details: err.message,
        });
      }

      db.get("SELECT * FROM users WHERE address = ?", [address], (err, row) => {
        if (err) {
          return res
            .status(500)
            .json({ error: "Database query error", details: err.message });
        }
        res.status(201).json(row);
      });
    }
  );
};

const handleDelete = (req: NextApiRequest, res: NextApiResponse) => {
  const { address } = req.body;

  console.log("Deleting user and associated patients for address:", address);

  db.run("BEGIN TRANSACTION", (beginErr) => {
    if (beginErr) {
      console.error("Error beginning transaction:", beginErr.message);
      return res
        .status(500)
        .json({ error: "Transaction start error", details: beginErr.message });
    }

    db.run("DELETE FROM users WHERE address = ?", [address], (userErr) => {
      if (userErr) {
        console.error("Error deleting user:", userErr.message);
        db.run("ROLLBACK");
        return res.status(500).json({
          error: "An error occurred while deleting the user.",
          details: userErr.message,
        });
      }

      console.log("User deleted successfully. Deleting associated patients...");

      db.run(
        "DELETE FROM patients WHERE owner = ?",
        [address],
        (patientErr) => {
          if (patientErr) {
            console.error("Error deleting patients:", patientErr.message);
            db.run("ROLLBACK");
            return res.status(500).json({
              error: "An error occurred while deleting the user's patients.",
              details: patientErr.message,
            });
          }

          console.log(
            "Patients deleted successfully. Committing transaction..."
          );

          db.run("COMMIT", (commitErr) => {
            if (commitErr) {
              console.error("Error during commit:", commitErr.message);
              db.run("ROLLBACK");
              return res.status(500).json({
                error: "An error occurred while committing the transaction.",
                details: commitErr.message,
              });
            }
            res.status(200).json({
              message: `User with address ${address} and all associated patients successfully deleted.`,
            });
          });
        }
      );
    });
  });
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
