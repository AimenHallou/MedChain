// src/components/GenericHistory.tsx
import React, { FC } from "react";
import { Patient } from "../../objects/types";

interface HistoryProps {
  title: string;
  data: Patient["history"][number][] | string;
}

const GenericHistory: FC<HistoryProps> = ({ title, data }) => {
  let parsedHistory: Patient["history"][number][];
  if (typeof data === "string") {
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
      {Array.isArray(parsedHistory) &&
        parsedHistory.map((entry, index) => {
          switch (entry.type) {
            case "patientCreated":
              return PatientCreated(entry, index);
            case "patientUpdated":
              return PatientUpdated(entry, index);
            case "request":
              return RequestAccess(entry, index);
            case "accepted":
              return AcceptRequest(entry, index);
            case "cancelled":
              return CancelledRequest(entry, index);
            case "unshared":
              return Unshared(entry, index);
            case "updated":
              return Updated(entry, index);
            case "transfer":
              return Ownership(entry, index);
            case "added":
              return Added(entry, index);
            default:
              return (
                <div
                  key={index}
                  className="text-sm text-gray-200 bg-gray-800 p-3 my-2 rounded-md shadow-lg"
                >
                  <p>{JSON.stringify(entry)}</p>
                </div>
              );
          }
        })}
    </div>
  );
};

const PatientCreated = (
  entry: Patient["history"][number],
  key: React.Key | null | undefined
) => {
  return (
    <div
      key={key}
      className="text-sm text-gray-200 bg-gray-800 p-3 my-2 rounded-md shadow-lg"
    >
      <p>Patient Created</p>
      <p className="break-words">{entry.requestor}</p>
      <p>{entry.timestamp}</p>
    </div>
  );
};

const PatientUpdated = (
  entry: Patient["history"][number],
  key: React.Key | null | undefined
) => {
  return (
    <div
      key={key}
      className="text-sm text-gray-200 bg-gray-800 p-3 my-2 rounded-md shadow-lg"
    >
      <p>Patient Updated</p>
      <p className="break-words">{entry.requestor}</p>
      <p>{entry.timestamp}</p>
    </div>
  );
};

const RequestAccess = (
  entry: Patient["history"][number],
  key: React.Key | null | undefined
) => {
  return (
    <div
      key={key}
      className="text-sm text-gray-200 bg-gray-800 p-3 my-2 rounded-md shadow-lg"
    >
      <p>Access requested by</p>
      <p className="break-words">{entry.requestor}</p>
      <p>{entry.timestamp}</p>
    </div>
  );
};

const AcceptRequest = (
  entry: Patient["history"][number],
  key: React.Key | null | undefined
) => {
  return (
    <div
      key={key}
      className="text-sm text-gray-200 bg-gray-800 p-3 my-2 rounded-md shadow-lg"
    >
      <p>Access accepted for</p>
      <p className="break-words">{entry.requestor}</p>
      <p>{entry.timestamp}</p>
    </div>
  );
};

const CancelledRequest = (
  entry: Patient["history"][number],
  key: React.Key | null | undefined
) => {
  return (
    <div
      key={key}
      className="text-sm text-gray-200 bg-gray-800 p-3 my-2 rounded-md shadow-lg"
    >
      <p>Access cancelled for</p>
      <p className="break-words">{entry.requestor}</p>
      <p>{entry.timestamp}</p>
    </div>
  );
};

const Unshared = (
  entry: Patient["history"][number],
  key: React.Key | null | undefined
) => {
  return (
    <div
      key={key}
      className="text-sm text-gray-200 bg-gray-800 p-3 my-2 rounded-md shadow-lg"
    >
      <p>Access unshared for</p>
      <p className="break-words">{entry.address}</p>
      <p>{entry.timestamp}</p>
    </div>
  );
};

const Updated = (
  entry: Patient["history"][number],
  key: React.Key | null | undefined
) => {
  return (
    <div
      key={key}
      className="text-sm text-gray-200 bg-gray-800 p-3 my-2 rounded-md shadow-lg"
    >
      <p>Files updated for</p>
      <p className="break-words">{entry.address}</p>
      <p>{entry.timestamp}</p>
    </div>
  );
};

const Ownership = (
  entry: Patient["history"][number],
  key: React.Key | null | undefined
) => {
  return (
    <div
      key={key}
      className="text-sm text-gray-200 bg-gray-800 p-3 my-2 rounded-md shadow-lg"
    >
      <p>Ownership transferred to</p>
      <p className="break-words">{entry.address}</p>
      <p>{entry.timestamp}</p>
    </div>
  );
};

const Added = (
  entry: Patient["history"][number],
  key: React.Key | null | undefined
) => {
  return (
    <div
      key={key}
      className="text-sm text-gray-200 bg-gray-800 p-3 my-2 rounded-md shadow-lg"
    >
      New file added at
      <p>{entry.timestamp}</p>
    </div>
  );
};

export default GenericHistory;
