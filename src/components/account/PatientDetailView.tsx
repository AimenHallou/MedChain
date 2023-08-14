// src/components/account/PatientDetailView.tsx

import React from 'react';
import PublishedPatients from '../PublishedPatients';
import AccessedPatients from '../AccessedPatients';

type PatientDetailViewProps = {
  showSection: string;
  setShowSection: React.Dispatch<React.SetStateAction<string>>;
};

const PatientDetailView: React.FC<PatientDetailViewProps> = ({ showSection, setShowSection }) => {
  return (
    <>
      <div className="flex justify-center gap-x-10 mb-4 mt-6">
        <button
          onClick={() => setShowSection("published")}
          className={`py-2 px-2 ${
            showSection === "published"
              ? "border-b text-white"
              : "bg-gray-700 text-gray-400"
          }`}
        >
          Published Patients
        </button>
        <button
          onClick={() => setShowSection("accessed")}
          className={`py-2 px-2 ${
            showSection === "accessed"
              ? "border-b text-white"
              : "bg-gray-700 text-gray-400"
          }`}
        >
          Accessed Patients
        </button>
      </div>
      {showSection === "published" && <PublishedPatients />}
      {showSection === "accessed" && <AccessedPatients />}
    </>
  );
};

export default PatientDetailView;
