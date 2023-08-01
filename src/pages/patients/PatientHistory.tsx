// src/components/pages/PatientHistory.tsx
import React, { FC } from "react";

const PatientHistory: FC<{ history: string }> = ({ history }) => {
  let parsedHistory = [];

  try {
    parsedHistory = JSON.parse(history);
  } catch (error) {
    console.error("Failed to parse patient history:", error);
  }

  return (
    <div className="px-4 py-2 bg-gray-700 rounded-lg">
      <div className="border-t-2 border-dashed border-white py-2">
        <h2 className="text-xl font-bold text-white">Patient Record History</h2>
      </div>
      {Array.isArray(parsedHistory) &&
        parsedHistory.map((entry, index) => (
          <div
            key={index}
            className="text-sm text-gray-200 bg-gray-800 p-3 my-2 rounded-md shadow-lg"
          >
            <p>{entry}</p>
          </div>
        ))}
    </div>
  );
};

export default PatientHistory;
