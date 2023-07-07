// src/components/RecentPatientData.tsx
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import PatientCard from './PatientCard';

const RecentPatientData: FC = () => {
  const patients = useSelector((state: RootState) => state.patients);
  const recentPatients = patients.slice(0, 5);

  return (
    <div className="bg-gray-800 text-white rounded-lg p-4 shadow mt-6  border-2 border-gray-600">
      <h2 className="text-lg font-bold mb-1">Recent Patient Data</h2>
      {recentPatients.map((patient) => (
        <PatientCard key={patient.id} {...patient} />
      ))}
    </div>
  );
};

export default RecentPatientData;
