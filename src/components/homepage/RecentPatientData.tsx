// src/components/homepage/RecentPatientData.tsx
import React, { FC, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { fetchPatients } from "../../redux/slices/patientSlice";
import PatientCard from "../PatientCard";
import { FaRegChartBar } from "react-icons/fa";

const RecentPatientData: FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const patients = useSelector((state: RootState) => state.patients);

  // Check if patients is defined and has a length
  let recentPatients = patients && patients.length ? patients.slice(0, 3) : [];

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  return (
    <div className="bg-module-background rounded-lg p-4 shadow mt-6 border-2 border-module-accent">
      <div className="flex space-x-2">
        <h2 className="text-lg font-bold mb-1 text-main-text">
          Recent Patient Data
        </h2>
        <FaRegChartBar size={24} />
      </div>
      {recentPatients.length > 0 ? (
        recentPatients.map((patient, index) => (
          <PatientCard
            key={patient.patient_id || `fallback-${index}`}
            {...patient}
          />
        ))
      ) : (
        <p className="text-sm font-semibold text-sub-text">
          No patients to Display
        </p>
      )}
    </div>
  );
};

export default RecentPatientData;
