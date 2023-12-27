// src/components/GenericHistory.tsx
import React, { FC } from "react";

interface HistoryProps {
  title: string;
  data: string[] | string;
}

const GenericHistory: FC<HistoryProps> = ({ title, data }) => {
  let parsedHistory;
  if (typeof data === 'string') {
    try {
      parsedHistory = JSON.parse(data);
    } catch (error) {
      console.error("Parsing error in GenericHistory", error);
      parsedHistory = [];
    }
  } else {
    parsedHistory = data;
  }

  return (
    <div className="px-4 py-2 bg-gray-700 rounded-lg">
      <div className="border-t-2 border-dashed border-white py-2">
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {Array.isArray(parsedHistory) && parsedHistory.map((entry, index) => (
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

export default GenericHistory;
