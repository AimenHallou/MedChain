// src/components/pages/PatientHistory.tsx
import React, { FC } from "react";

interface PatientHistoryProps {
  history: string[];
}

const PatientHistory: FC<PatientHistoryProps> = ({ history }) => (
  <div className="px-4 py-2 bg-gray-900">
    <h2 className="text-lg font-bold text-white">Patient Record History</h2>
    {history.map((entry, index) => (
      <p key={index} className="text-sm text-white">
        {entry}
      </p>
    ))}
  </div>
);

export default PatientHistory;
