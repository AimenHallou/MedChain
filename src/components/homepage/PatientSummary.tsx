// src/components/homepage/PatientSummary.tsx
import React, { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FaUserInjured } from "react-icons/fa";

const PatientSummary: FC = () => {
  const patients = useSelector((state: RootState) => state.patients);
  const totalPatients = patients.length;

  return (
    <div className="bg-module-background text-white rounded-lg p-4 shadow border-2 border-gray-600">
      <div className="flex space-x-2">
        <h2 className="text-lg font-bold mb-1">Patient Summary</h2>
        <FaUserInjured size={24}/>
      </div>
      <p className="text-sm font-semibold text-gray-400">
        Total Patients: {totalPatients}
      </p>
    </div>
  );
};

export default PatientSummary;
