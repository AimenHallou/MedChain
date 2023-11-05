// src/components/GenericHistory.tsx
import React, { FC } from "react";

interface HistoryProps {
  title: string;
  data: string[];
}

const GenericHistory: FC<HistoryProps> = ({ title, data }) => {
console.log(typeof(data))
console.log("here is the history",data)
let parsedHistory = Array.isArray(data) ? history : JSON.parse(data);

  return (
    <div className="px-4 py-2 bg-gray-700 rounded-lg">
      <div className="border-t-2 border-dashed border-white py-2">
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {parsedHistory.map((entry, index) => (
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
