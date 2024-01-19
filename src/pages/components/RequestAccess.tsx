// src/components/pages/RequestAccess.tsx
import React, { FC, useState } from "react";
import { IoIosClose, IoIosCheckmark } from "react-icons/io";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";

interface RequestAccessProps {
  itemId: string;
  requestPending: boolean;
  handleRequestAccess: () => void;
  handleCancelRequest: () => void;
  handleAcceptRequest: (requestor: string, files: string[]) => void;
  handleRejectRequest: (requestor: string) => void;
  accessRequests?: string[];
  currentUserAddress: string | null;
  ownerAddress: string;
  accessList: string[];
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  selectedRequestor: string | null;
  setSelectedRequestor: (requestor: string | null) => void;
}

const RequestAccess: FC<RequestAccessProps> = ({
  itemId,
  requestPending,
  handleRequestAccess,
  handleCancelRequest,
  handleAcceptRequest,
  handleRejectRequest,
  accessRequests = [],
  currentUserAddress,
  ownerAddress,
  accessList = [],
  selectedFiles,
  setSelectedFiles,
  setSelectedRequestor,
  selectedRequestor,
}) => {
  console.log("accessRequests:", accessRequests);

  return (
    <div className="flex">
      {currentUserAddress !== ownerAddress &&
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
      {currentUserAddress === ownerAddress && accessRequests.length > 0 && (
        <>
          <h3 className="text-lg font-bold text-white mt-2 mr-2">Requests:</h3>
          {accessRequests?.map((requestor) => {
            return (
              <div
                key={`${itemId}-${requestor}`}
                className="grid grid-cols-6 gap-1 items-center p-1 mb-1 rounded-lg bg-gray-800"
              >
                <span
                  className="col-span-4 text-xxs py-1 px-1 text-gray-200 cursor-pointer bg-gray-800 rounded-t-lg truncate w-full"
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
                        className="w-6 h-6"
                      />
                      <IoIosClose
                        onClick={() => handleRejectRequest(requestor)}
                        className="w-6 h-6"
                      />
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6" />
                      <div className="w-6 h-6" />
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

export default RequestAccess;
