// src/components/pages/PatientOwnerActions.tsx
import React, { FC } from "react";

interface PatientOwnerActionsProps {
  isEditing: boolean;
  newOwner: string;
  setNewOwner: (value: string) => void;
  handleTransfer: () => void;
  sharedAddress: string;
  setSharedAddress: (value: string) => void;
  handleShare: () => void;
  sharedWith: string[];
  handleUnshare: (address: string) => void;
}

const PatientOwnerActions: FC<PatientOwnerActionsProps> = ({
  isEditing,
  newOwner,
  setNewOwner,
  handleTransfer,
  sharedAddress,
  setSharedAddress,
  handleShare,
  sharedWith = [],
  handleUnshare,
}) => {
  if (isEditing) return null;

  return (
    <div className=" w-full">
      <input
        className="shadow appearance-none border rounded-t-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
        type="text"
        placeholder="Enter new owner's address"
        value={newOwner}
        onChange={(e) => setNewOwner(e.target.value)}
      />
      <button
        className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-b-lg focus:outline-none focus:shadow-outline w-full"
        onClick={handleTransfer}
      >
        Transfer Ownership
      </button>
      <input
        className="shadow appearance-none border rounded-t-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
        type="text"
        placeholder="Enter address to share with"
        value={sharedAddress}
        onChange={(e) => setSharedAddress(e.target.value)}
      />
      <button
        className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-b-lg focus:outline-none focus:shadow-outline w-full"
        onClick={handleShare}
      >
        Share Patient
      </button>
      <div className="py-2">
        {sharedWith.map((address, index) => (
          <div
            key={index}
            className="grid grid-cols-6 gap-2 items-center p-2 mb-1 rounded-md bg-gray-700"
          >
            <span className="col-span-5 text-sm text-gray-200">{address}</span>
            <button
              className="col-span-1 text-sm bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              onClick={() => handleUnshare(address)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientOwnerActions;
