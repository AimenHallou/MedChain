// src/components/PublishedPatient.tsx
import React, { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import PatientCard from "./PatientCard";

const PublishedPatient: FC = () => {
  const { users, currentUserAddress } = useSelector((state: RootState) => state.user);
  const patients = useSelector((state: RootState) => state.patients);

  const currentUser = users.find(user => user.address === currentUserAddress);
  
  const publishedPatient = patients.filter((patient) => patient.owner === currentUser?.address);

  return (
    <div>
      <h2>Published Patient</h2>
      {publishedPatient.map((patient) => (
        <PatientCard key={patient.id} {...patient} />
      ))}
    </div>
  );
};

export default PublishedPatient;