// pages/api/patients/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../db/database";
import Web3 from "web3";
import fs from "fs";
import { Patient } from "../../../objects/types";

// Configure Web3
// const web3 = new Web3("http://127.0.0.1:8545");
// const contractJSON = JSON.parse(
//   fs.readFileSync("./build/contracts/PatientRegistry.json", "utf8")
// );
// const abi = contractJSON.abi;
// import developmentConfig from "../../../../config/development";
// import productionConfig from "../../../../config/production";
// import { getSetting } from "../../../utils/config";

// let config;

// if (process.env.NODE_ENV === "production") {
//   config = productionConfig;
// } else {
//   config = developmentConfig;
// }
// const contractAddress = config.patientRegistryContract;
// const contractInstance = new web3.eth.Contract(abi, contractAddress);

// const storageMode = getSetting("storageMode");

const fetchPatients = (res: NextApiResponse) => {
  db.all("SELECT * FROM patients", [], (err, rows) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Database query error", details: err.message });
    }
    res.status(200).json(rows);
  });
};

const handleCreatePatient = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
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
    // if (storageMode === "blockchain") {
    //   const txReceipt = await contractInstance.methods
    //     .createPatient(patient_id, history[0], "")
    //     .send({
    //       from: owner,
    //       gas: 3000000,
    //       gasPrice: "20000000000",
    //     });
    //   history.push(`Transaction hash: ${txReceipt.transactionHash}`);
    // } else {
    // }
    history.push(`Transaction hash: ${"N/A"}`);

    db.run(
      "INSERT INTO patients(patient_id, owner, createdDate, content, sharedWith, history, accessRequests) VALUES(?, ?, ?, ?, ?, ?, ?)",
      [
        patient_id,
        owner,
        createdDate,
        JSON.stringify(content),
        JSON.stringify(sharedWith),
        JSON.stringify(history),
        JSON.stringify(accessRequests),
      ],
      function (err) {
        if (err) {
          return res.status(500).json({
            error: "An error occurred while inserting into the database.",
            details: err.message,
          });
        }
        db.get(
          "SELECT * FROM patients WHERE patient_id = ?",
          [patient_id],
          (err, row: Patient | undefined) => {
            if (err) {
              return res.status(500).json({
                error: "An error occurred while querying the database.",
                details: err.message,
              });
            }
            if (!row) {
              return res.status(404).json({ error: "Patient not found." });
            }
            res.status(201).json({
              ...row,
              content: JSON.parse(row.content?.toString() || "[]"),
              sharedWith: JSON.parse(row.sharedWith.toString()),
              history: JSON.parse(row.history.toString()),
              accessRequests: JSON.parse(
                row.accessRequests?.toString() || "[]"
              ),
            });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error interacting with the contract", error);
    res.status(500).send("Error interacting with blockchain");
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
