// src/components/pages/PatientRequestAccess.tsx
import React, { FC } from "react";

interface PatientRequestAccessProps {
  patientId: string;
  requestPending: boolean;
  handleRequestAccess: () => void;
  handleCancelRequest: () => void;
  handleAcceptRequest: (requestor: string) => void;
  handleRejectRequest: (requestor: string) => void;
  accessRequests?: string[];
  currentUserAddress: string | null;
  patientOwner: string;
  accessList: string[];
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
}) => (
  <div className="mt-4">
    {currentUserAddress !== patientOwner &&
      !accessList.includes(currentUserAddress || "") && (
        <div>
          <button
            className={`text-white text-sm font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              requestPending ? "bg-yellow-500" : "bg-blue-500 hover:bg-blue-700"
            }`}
            onClick={requestPending ? handleCancelRequest : handleRequestAccess}
          >
            {requestPending ? "Cancel Request" : "Request Access"}
          </button>
        </div>
      )}
    {currentUserAddress === patientOwner && accessRequests.length > 0 && (
      <>
        <h3 className="text-lg font-bold text-white mt-4">Request List:</h3>
        {accessRequests.map((requestor) => (
          <div
            key={`${patientId}-${requestor}`}
            className="grid grid-cols-6 gap-2 items-center p-2 mb-1 rounded-md bg-gray-700"
          >
            <span className="col-span-5 text-sm text-gray-200">{requestor}</span>
            <div className="col-span-1 flex justify-end">
              <button
                onClick={() => handleAcceptRequest(requestor)}
                className="w-9 mr-2"
              >
                <img src="/images/check.png" alt="Accept" />
              </button>
              <button
                onClick={() => handleRejectRequest(requestor)}
                className="w-7"
              >
                <img src="/images/close.png" alt="Reject" />
              </button>
            </div>
          </div>
        ))}
      </>
    )}
  </div>
);

export default PatientRequestAccess;
