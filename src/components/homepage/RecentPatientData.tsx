// src/components/homepage/RecentPatientData.tsx
import React, { FC, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchPatients } from "../../redux/slices/patientSlice";
import PatientCard from "../PatientCard";

const RecentPatientData: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const patients = useSelector((state: RootState) => state.patients);
  const recentPatients = Array.isArray(patients) ? patients.slice(0, 3) : [];

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  return (
    <div className="bg-gray-700 text-white rounded-lg p-4 shadow mt-6  border-2 border-gray-600">
      <h2 className="text-lg font-bold mb-1">Recent Patient Data</h2>
      {recentPatients.map((patient, index) => (
        <PatientCard
          key={patient.patient_id || `fallback-${index}`}
          {...patient}
        />
      ))}
    </div>
  );
};

export default RecentPatientData;
