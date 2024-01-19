// pages/api/patients/[patient_id]/request.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../../db/database";
import Web3 from "web3";
import fs from "fs";
import getConfig from "next/config";
import { Patient } from "../../../../objects/types";
import { getSetting } from "../../../../utils/config";

// Configure Web3
const web3 = new Web3("http://127.0.0.1:8545");
const contractJSON = JSON.parse(
  fs.readFileSync("./build/contracts/PatientRegistry.json", "utf8")
);
const abi = contractJSON.abi;
const storageMode = getSetting("storageMode");

// Get the configuration depending on the environment
const { serverRuntimeConfig } = getConfig();
const contractAddress = serverRuntimeConfig.patientRegistryContract;
const contractInstance = new web3.eth.Contract(abi, contractAddress);

async function handleRequestAccess(
  patient_id: string,
  body: any,
  res: NextApiResponse
) {
  const { requestor } = body;

  db.get(
    `SELECT history, owner FROM patients WHERE patient_id = ?`,
    [patient_id],
    async (err, row: Patient | undefined) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Database query error", details: err.message });
      }

      if (!row) {
        return res
          .status(404)
          .json({ error: `No patient found with ID: ${patient_id}` });
      }

      const owner = row.owner;
      let history = JSON.parse(row.history.toString());
      history.unshift(
        {type: "request", timestamp: new Date().toISOString(), requestor}
      );

      try {
        if (storageMode === "blockchain") {
          await contractInstance.methods
            .requestAccess(patient_id, requestor)
            .send({
              from: requestor,
              gas: 3000000,
              gasPrice: "20000000000",
            });
        }
      } catch (error) {
        console.error("Error interacting with the contract", error);
        return res
          .status(500)
          .json({ error: "Error interacting with blockchain" });
      }

      db.run(
        `UPDATE patients SET accessRequests = json_insert(ifnull(accessRequests, '[]'), '$[0]', ?), history = ? WHERE patient_id = ?`,
        [requestor, JSON.stringify(history), patient_id],
        function (err) {
          if (err) {
            return res.status(500).json({
              error:
                "An error occurred while requesting access in the database.",
              details: err.message,
            });
          }
          db.get(
            "SELECT * FROM patients WHERE patient_id = ?",
            [patient_id],
            (err, updatedRow) => {
              if (err) {
                return res.status(500).json({
                  error: "Failed to fetch updated patient data",
                  details: err.message,
                });
              }
              res.json(updatedRow);
            }
          );
        }
      );
    }
  );
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { patient_id } = req.query;

  if (typeof patient_id !== "string") {
    return res.status(400).json({ error: "Invalid patient ID" });
  }

  if (req.method === "PUT") {
    handleRequestAccess(patient_id, req.body, res);
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
