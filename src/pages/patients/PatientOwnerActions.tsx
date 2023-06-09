// src/components/pages/PatientOwnerActions.tsx
import React, { FC } from "react";
import { IoIosClose } from "react-icons/io";
import { MdUpdate } from "react-icons/md";
import { Patient } from "../../objects/types";

interface PatientOwnerActionsProps {
  isEditing: boolean;
  newOwner: string;
  setNewOwner: (value: string) => void;
  handleTransfer: () => void;
  sharedAddress: string;
  setSharedAddress: (value: string) => void;
  handleShare: (user: string) => void;
  sharedWith: string[];
  handleUnshare: (address: string) => void;
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  selectedUser: string | null;
  setSelectedUser: (user: string | null) => void;
  handleUpdateSharedFiles: (address: string, files: string[]) => void;
  patient: Patient;
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
  selectedFiles,
  setSelectedFiles,
  selectedUser,
  setSelectedUser,
  handleUpdateSharedFiles,
  patient,
}) => {
  if (isEditing) return null;

  return (
    <div className="justify-center">
      <input
        className="shadow appearance-none rounded-t-lg w-full py-2 px-3 bg-gray-800 text-gray-700 leading-tight mt-2"
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
        className="shadow appearance-none rounded-t-lg w-full py-2 px-3 bg-gray-800 text-gray-700 leading-tight mt-2"
        type="text"
        placeholder="Enter address to share with"
        value={sharedAddress}
        onChange={(e) => setSharedAddress(e.target.value)}
      />
      <button
        className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-b-lg focus:outline-none focus:shadow-outline w-full"
        onClick={() => {
          if (selectedUser) {
            handleShare(selectedUser);
            setSelectedUser(null);
          }
        }}
      >
        Share Patient
      </button>
      <div className="py-2">
        {sharedWith.map((address, index) => {
          const currentFiles = patient.sharedWith[address] || [];
          const hasChanges = JSON.stringify([...currentFiles].sort()) !== JSON.stringify([...selectedFiles].sort());

          return (
            <div
              key={index}
              className={`grid grid-cols-10 gap-2 items-center p-2 mb-1 rounded-md ${
                selectedUser === address ? "bg-gray-900" : "bg-gray-800"
              }`}
            >
              <span
                className="col-span-7 text-sm text-gray-200 cursor-pointer"
                onClick={() => {
                  if (selectedUser === address) {
                    setSelectedUser(null);
                    setSelectedFiles([]);
                  } else {
                    setSelectedUser(address);
                    const userFiles = patient.sharedWith[address];
                    setSelectedFiles(userFiles || []);
                  }
                }}
              >
                {address}
              </span>
              <MdUpdate
                className={`col-span-1 h-6 w-6 centered cursor-pointer ${selectedUser === address && hasChanges ? 'text-white' : 'text-white opacity-0'}`}
                onClick={() => handleUpdateSharedFiles(address, selectedFiles)}
              />
              <IoIosClose
                className={`col-span-2 h-10 w-10 centered cursor-pointer ${selectedUser === address ? 'text-white' : 'text-white opacity-0'}`}
                onClick={() => handleUnshare(address)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PatientOwnerActions;
