// src/components/PatientSummary.tsx
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const PatientSummary: FC = () => {
  const patients = useSelector((state: RootState) => state.patients);
  const totalPatients = patients.length;

  return (
    <div className="bg-gray-800 text-white rounded-lg p-4 shadow border-2 border-gray-600">
      <h2 className="text-lg font-bold mb-1">Patient Summary</h2>
      <p className="text-sm">Total Patients: <strong>{totalPatients}</strong></p>
    </div>
  );
};

export default PatientSummary;
