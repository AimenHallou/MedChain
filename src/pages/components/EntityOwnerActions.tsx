import React, { FC, useEffect, useMemo } from "react";
import { IoIosClose } from "react-icons/io";
import { MdUpdate } from "react-icons/md";

interface EntityOwnerActionsProps {
  newOwner: string;
  setNewOwner: (value: string) => void;
  handleTransfer: () => void;
  sharedAddress: string;
  setSharedAddress: (value: string) => void;
  handleShare: (user: string) => void;
  sharedWith: { [address: string]: string[] };
  handleUnshare: (address: string) => void;
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  selectedUser: string | null;
  setSelectedUser: (user: string | null) => void;
  handleUpdateSharedFiles: (address: string, files: string[]) => void;
  entity: any;
}

const EntityOwnerActions: FC<EntityOwnerActionsProps> = ({
  newOwner,
  setNewOwner,
  handleTransfer,
  sharedAddress,
  setSharedAddress,
  handleShare,
  sharedWith,
  handleUnshare,
  selectedFiles,
  setSelectedFiles,
  selectedUser,
  setSelectedUser,
  handleUpdateSharedFiles,
  entity,
}) => {
  sharedWith = useMemo(() => {
    if (typeof sharedWith === "string") {
      try {
        return JSON.parse(sharedWith);
      } catch (error) {
        console.error("Error parsing sharedWith:", error);
      }
    }
    return sharedWith || {};
  }, [sharedWith]);

  const entitySharedWith = useMemo(() => {
    if (entity && typeof entity.sharedWith === "string") {
      try {
        return JSON.parse(entity.sharedWith);
      } catch (error) {
        console.error("Error parsing entity.sharedWith:", error);
        return {};
      }
    }
    return entity?.sharedWith || {};
  }, [entity?.sharedWith]);

  const parsedSharedWith =
    sharedWith && typeof sharedWith === "object" ? Object.keys(sharedWith) : [];

  const renderSharedAddresses = () => {
    return parsedSharedWith.map((address, index) => {
      const currentFiles = entitySharedWith[address] || [];
      const hasChanges =
        JSON.stringify([...currentFiles].sort()) !==
        JSON.stringify([...selectedFiles].sort());

      return (
        <div
          key={index}
          className={`grid grid-cols-10 gap-2 items-center p-2 mb-1 rounded-md cursor-pointer ${
            selectedUser === address ? "bg-gray-900" : "bg-gray-800"
          }`}
          onClick={() => {
            if (selectedUser === address) {
              setSelectedUser(null);
              setSelectedFiles([]);
            } else {
              setSelectedUser(address);
              const userFiles = entitySharedWith[address];
              setSelectedFiles(userFiles || []);
            }
          }}
        >
          <span className="col-span-7 text-sm text-gray-200 select-none truncate">
            {address}
          </span>
          <MdUpdate
            className={`col-span-1 h-6 w-6 centered cursor-pointer ${
              selectedUser === address && hasChanges
                ? "text-white"
                : "text-white opacity-0"
            }`}
            onClick={() => handleUpdateSharedFiles(address, selectedFiles)}
          />
          <IoIosClose
            className={`col-span-2 h-10 w-10 centered cursor-pointer ${
              selectedUser === address ? "text-white" : "text-white opacity-0"
            }`}
            onClick={() => handleUnshare(address)}
          />
        </div>
      );
    });
  };

  return (
    <div className="justify-center">
      {/* <input
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
          if (sharedAddress) {
            handleShare(sharedAddress);
            setSharedAddress("");
          }
        }}
      >
        Share Patient
      </button> */}
      <div className="py-2">{renderSharedAddresses()}</div>
    </div>
  );
};

export default EntityOwnerActions;
