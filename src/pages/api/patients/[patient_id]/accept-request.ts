// pages/api/patients/[patient_id]/accept-request.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../../db/database";
import Web3 from "web3";
import fs from "fs";
import { Patient } from "../../../../objects/types";

// Configure Web3
const web3 = new Web3("http://127.0.0.1:8545");
const contractJSON = JSON.parse(
  fs.readFileSync("./build/contracts/PatientRegistry.json", "utf8")
);
const abi = contractJSON.abi;
import developmentConfig from "../../../../../config/development";
import productionConfig from "../../../../../config/production";
import { getSetting } from "../../../../utils/config";

let config;

if (process.env.NODE_ENV === "production") {
  config = productionConfig;
} else {
  config = developmentConfig;
}
const contractAddress = config.patientRegistryContract;
const contractInstance = new web3.eth.Contract(abi, contractAddress);

const storageMode = getSetting("storageMode");

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { patient_id } = req.query;

  if (typeof patient_id !== "string") {
    return res.status(400).json({ error: "Invalid patient ID" });
  }

  if (req.method === "PUT") {
    handleAcceptRequest(patient_id, req.body, res);
  } else {
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function handleAcceptRequest(
  patient_id: string,
  body: any,
  res: NextApiResponse
) {
  const { requestor, files } = body;

  db.get(
    `SELECT history, accessRequests, sharedWith FROM patients WHERE patient_id = ?`,
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

      let accessRequests = JSON.parse(row.accessRequests?.toString() || "[]");
      accessRequests = accessRequests.filter((item) => item !== requestor);

      let sharedWith = JSON.parse(row.sharedWith?.toString() || "{}");
      sharedWith[requestor] = files;

      let history = JSON.parse(row.history?.toString() || "[]");
      history.unshift(
        `Access request by ${requestor} accepted on ${new Date().toISOString()}`
      );

      try {
        if (storageMode === "blockchain") {
          await contractInstance.methods
            .acceptAccessRequest(patient_id, requestor, files)
            .send({
              from: requestor,
              gas: 3000000,
              gasPrice: "20000000000",
            });
        }
      } catch (error) {
        console.error("Error interacting with the contract", error);
        return res.status(500).send("Error interacting with blockchain");
      }
    }
  );
}
