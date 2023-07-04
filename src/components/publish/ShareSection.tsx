// src/components/publish/ShareSection.tsx
import React, { useState } from "react";

interface ShareSectionProps {
  sharedUsers: string[];
  setSharedUsers: React.Dispatch<React.SetStateAction<string[]>>;
}

const ShareSection: React.FC<ShareSectionProps> = ({
  sharedUsers,
  setSharedUsers,
}) => {
  const [shareWith, setShareWith] = useState("");

  const handleShareWithChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShareWith(event.target.value);
  };

  const handleAddSharedUser = () => {
    setSharedUsers([...sharedUsers, shareWith]);
    setShareWith("");
  };

  const handleRemoveSharedUser = (address: string) => {
    setSharedUsers(sharedUsers.filter((user) => user !== address));
  };

  return (
    <div className="mb-4">
      <div className="">
        <label className="block text-white font-bold mb-2" htmlFor="share">
          Share
        </label>
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="Enter address to share with"
            value={shareWith}
            onChange={handleShareWithChange}
            className="w-4/6 px-3 py-2 text-white placeholder-gray-400 bg-gray-800 rounded-l outline-none focus:bg-gray-900"
          />
          <button
            type="button"
            onClick={handleAddSharedUser}
            className="w-2/6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-r"
          >
            Add User
          </button>
        </div>
        <div className="mb-4">
          {sharedUsers.map((address, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-800 px-3 py-2 rounded mt-2"
            >
              <span className="text-white">{address}</span>
              <button
                type="button"
                onClick={() => handleRemoveSharedUser(address)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareSection;
