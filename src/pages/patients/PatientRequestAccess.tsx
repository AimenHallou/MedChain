// src/components/pages/PatientRequestAccess.tsx
import React, { FC, useState } from "react";
import { IoIosClose, IoIosCheckmark } from "react-icons/io";

interface PatientRequestAccessProps {
  patientId: string;
  requestPending: boolean;
  handleRequestAccess: () => void;
  handleCancelRequest: () => void;
  handleAcceptRequest: (requestor: string, files: string[]) => void;
  handleRejectRequest: (requestor: string) => void;
  accessRequests?: string[];
  currentUserAddress: string | null;
  patientOwner: string;
  accessList: string[];
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  selectedRequestor: string | null;
  setSelectedRequestor: (requestor: string | null) => void;
}

const PatientRequestAccess: FC<PatientRequestAccessProps> = ({
  patientId,
  requestPending,
  handleRequestAccess,
  handleCancelRequest,
  handleAcceptRequest,
  handleRejectRequest,
  accessRequests = [],
  currentUserAddress,
  patientOwner,
  accessList = [],
  selectedFiles,
  setSelectedFiles,
  setSelectedRequestor,
  selectedRequestor,
}) => {
  return (
    <div className="flex justify-center">
      {currentUserAddress !== patientOwner &&
        !accessList.includes(currentUserAddress || "") && (
          <div>
            <button
              className={`text-white text-sm font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                requestPending
                  ? "bg-yellow-500"
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
              onClick={
                requestPending ? handleCancelRequest : handleRequestAccess
              }
            >
              {requestPending ? "Cancel Request" : "Request Access"}
            </button>
          </div>
        )}
      {currentUserAddress === patientOwner && accessRequests.length > 0 && (
        <>
          <h3 className="text-lg font-bold text-white mt-4 mr-2">Requests:</h3>
          {accessRequests.map((requestor) => (
            <div
              key={`${patientId}-${requestor}`}
              className="grid grid-cols-6 gap-2 items-center p-2 mb-1 rounded-md bg-gray-800"
            >
              <span
                className="col-span-4 text-sm text-gray-200 cursor-pointer"
                onClick={() => {
                  if (selectedRequestor === requestor) {
                    setSelectedFiles([]);
                    setSelectedRequestor(null);
                  } else {
                    setSelectedFiles([]);
                    setSelectedRequestor(requestor);
                  }
                }}
              >
                {requestor}
              </span>
              <div className="col-span-2 flex justify-end">
                {selectedRequestor === requestor ? (
                  <>
                    <IoIosCheckmark
                      onClick={() => {
                        handleAcceptRequest(requestor, selectedFiles);
                        setSelectedFiles([]);
                      }}
                      className="w-10 h-10"
                    />
                    <IoIosClose
                      onClick={() => handleRejectRequest(requestor)}
                      className="w-10 h-10"
                    />
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10" />
                    <div className="w-10 h-10" />
                  </>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default PatientRequestAccess;
