import React, { FC } from "react";
import { useSelector } from "react-redux";
import PatientCard from "./PatientCard";
import { RootState } from "../redux/store";
import { Patient } from "../objects/types";
import Link from "next/link";

interface PatientListProps {
  searchTerm: string;
}

const PatientList: FC<PatientListProps> = ({ searchTerm }) => {
  const patients = useSelector((state: RootState) => state.patients);
  const filteredPatients = patients.filter(patient =>
    patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div>
      <div className= "text-center">
      <Link href="/publish">
      <button className="px-6 py-4 bg-blue-700 text-white rounded cursor-pointer mb-8">
          Add Patient
        </button>
        </Link>
      </div>
      <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients &&
          filteredPatients.map((patient: Patient) => <PatientCard key={patient.id} {...patient} />)}
      </div>
    </div>
  );
};

export default PatientList;
