// src/components/pages/AssetOwnerActions.tsx
import React, { FC } from "react";

interface AssetOwnerActionsProps {
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

const AssetOwnerActions: FC<AssetOwnerActionsProps> = ({
  isEditing,
  newOwner,
  setNewOwner,
  handleTransfer,
  sharedAddress,
  setSharedAddress,
  handleShare,
  sharedWith,
  handleUnshare,
}) => {
  if (isEditing) return null;

  return (
    <div className="md:w-1/3 w-full md:ml-4">
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-2"
        type="text"
        placeholder="Enter new owner's address"
        value={newOwner}
        onChange={(e) => setNewOwner(e.target.value)}
      />
      <button
        className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        onClick={handleTransfer}
      >
        Transfer Ownership
      </button>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-2"
        type="text"
        placeholder="Enter address to share with"
        value={sharedAddress}
        onChange={(e) => setSharedAddress(e.target.value)}
      />
      <button
        className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        onClick={handleShare}
      >
        Share Asset
      </button>
      <div className="py-2">
        {sharedWith.map((address, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">{address}</span>
            <button
              className="text-sm bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
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

export default AssetOwnerActions;
