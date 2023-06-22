import React, { FC } from "react";
import { useSelector } from "react-redux";
import PatientCard from "./PatientCard";
import { RootState } from "../redux/store";
import { Patient } from "../objects/types";

interface PatientListProps {
  searchTerm: string;
}

const PatientList: FC<PatientListProps> = ({ searchTerm }) => {
  const patients = useSelector((state: RootState) => state.patients);
  const filteredPatients = patients.filter(patient =>
    patient.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-8">Patient</h1>
      <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients &&
          filteredPatients.map((patient: Patient) => <PatientCard key={patient.id} {...patient} />)}
      </div>
    </div>
  );
};

export default PatientList;
