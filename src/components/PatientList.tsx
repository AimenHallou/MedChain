// src/components/PatientList.tsx
import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import PatientCard from "./PatientCard";
import { RootState } from "../redux/store";
import { Patient } from "../objects/types";
import Link from "next/link";
import SearchBar from "./SearchBar";

const PatientList: FC = () => {
  const patients = useSelector((state: RootState) => state.patients);
  
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient =>
    patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <div className="bg-gray-700 text-white rounded-lg p-4 shadow  border-2 border-gray-600">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Patients</h2>
        <SearchBar onSearch={handleSearch} />
        <Link href="/publish">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
            Add Patient
          </button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients &&
          filteredPatients.map((patient: Patient) => <PatientCard key={patient.id} {...patient} />)}
      </div>
    </div>
  );
};

export default PatientList;
