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
  console.log("Current User Address:", currentUser?.address);
  const accessedPatients = patients.filter((patient) => {
    return Object.keys(patient.sharedWith).includes(currentUser?.address || "");
  });

  console.log("Accessed Patients:", accessedPatients);

  return (
    <div>
      {accessedPatients.map((patient) => (
        <PatientCard key={patient.patient_id} {...patient} />
      ))}
    </div>
  );
};

export default AccessedPatients;
