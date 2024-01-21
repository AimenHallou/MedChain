// src/components/account/UserDetailView.tsx

import React, { useState } from "react";

type UserDetailViewProps = {
  web3Address: string | null;
  userExists: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
  handleAddUser: () => void;
  newUserName: string;
  setNewUserName: React.Dispatch<React.SetStateAction<string>>;
  healthcareType: string;
  setHealthcareType: React.Dispatch<React.SetStateAction<string>>;
  organizationName: string;
  setOrganizationName: React.Dispatch<React.SetStateAction<string>>;
  handleUpdateUser: () => void;
};

const UserDetailView: React.FC<UserDetailViewProps> = ({
  web3Address,
  userExists,
  handleLogin,
  handleLogout,
  handleAddUser,
  newUserName,
  setNewUserName,
  healthcareType,
  setHealthcareType,
  organizationName,
  setOrganizationName,
  handleUpdateUser,
}) => {
  const [editMode, setEditMode] = useState(false);

  const renderEditForm = () => (
    <>
      <input
        type="text"
        value={newUserName}
        placeholder="Name"
        onChange={(e) => setNewUserName(e.target.value)}
        className="block bg-gray-800 placeholder-gray-400 text-white border border-gray-600 rounded p-2 w-full my-2"
      />
      <input
        type="text"
        value={healthcareType}
        placeholder="Type of Healthcare Provider"
        onChange={(e) => setHealthcareType(e.target.value)}
        className="block bg-gray-800 placeholder-gray-400 text-white border border-gray-600 rounded p-2 w-full my-2"
      />
      <input
        type="text"
        value={organizationName}
        placeholder="Organization Name"
        onChange={(e) => setOrganizationName(e.target.value)}
        className="block bg-gray-800 placeholder-gray-400 text-white border border-gray-600 rounded p-2 w-full my-2"
      />
      <button
        onClick={() => {
          handleUpdateUser();
          setEditMode(false);
        }}
        className="block bg-blue-500 text-white px-4 py-2 rounded-lg my-2"
      >
        Update User
      </button>
    </>
  );
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">User Account</h2>
      </div>
      <div className="mb-4">
        <div className="mb-4">
          <div className="font-bold mb-2">Address: {web3Address || "N/A"}</div>
          <div className="font-bold mb-2">Name: {newUserName || "N/A"}</div>
          <div className="font-bold mb-2">
            Healthcare Type: {healthcareType || "N/A"}
          </div>
          <div className="font-bold mb-2">
            Organization: {organizationName || "N/A"}
          </div>
          {web3Address && userExists && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="block bg-blue-500 text-white px-4 py-2 rounded-lg my-2"
            >
              Edit Account
            </button>
          )}
          {editMode && renderEditForm()}
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={web3Address ? handleLogout : handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
          >
            {web3Address ? "Logout" : "Login with MetaMask"}
          </button>
          {web3Address && !userExists && (
            <button
              onClick={handleAddUser}
              className="block bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add User
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDetailView;
