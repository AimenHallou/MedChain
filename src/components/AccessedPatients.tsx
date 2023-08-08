// src/components/AccessedPatients.tsx
import React, { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import PatientCard from "./PatientCard";

const AccessedPatients: FC = () => {
  const { users, currentUserAddress } = useSelector(
    (state: RootState) => state.user
  );
  const patients = useSelector((state: RootState) => state.patients);

  const currentUser = users.find((user) => user.address === currentUserAddress);

  const accessedPatients = patients.filter((patient) => {
    let sharedWithObj = patient.sharedWith;
  
    if (typeof patient.sharedWith === "string") {
      try {
        sharedWithObj = JSON.parse(patient.sharedWith);
      } catch (error) {
        console.error("Failed to parse sharedWith:", error);
        return false;
      }
    }
  
    return Object.keys(sharedWithObj).includes(currentUser?.address || "");
  });
  
  return (
    <div>
      {accessedPatients.map((patient) => (
        <PatientCard key={patient.patient_id} {...patient} />
      ))}
    </div>
  );
};

export default AccessedPatients;
