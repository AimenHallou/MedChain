// src/components/account/UserDetailView.tsx
import React, { useState } from "react";

type UserDetailViewProps = {
  web3Address: string | null;
  userExists: boolean;
  handleLogin: () => void;
  handleLogout: () => void;
  handleAddUser: () => void;
  handleUpdateUser: () => void;
  handleDeleteUser: () => void;
  newUserName: string;
  setNewUserName: React.Dispatch<React.SetStateAction<string>>;
  healthcareType: string;
  setHealthcareType: React.Dispatch<React.SetStateAction<string>>;
  organizationName: string;
  setOrganizationName: React.Dispatch<React.SetStateAction<string>>;
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
  handleDeleteUser,
}) => {
  const [editMode, setEditMode] = useState(false);

  const renderForm = (isAddingUser: boolean) => (
    <div className="space-y-4 bg-gray-800 p-4 rounded-lg shadow-md">
      <input
        type="text"
        value={newUserName}
        placeholder="Name"
        onChange={(e) => setNewUserName(e.target.value)}
        className="block w-full px-3 py-2 rounded-md text-gray-700"
      />
      <input
        type="text"
        value={healthcareType}
        placeholder="Type of Healthcare Provider"
        onChange={(e) => setHealthcareType(e.target.value)}
        className="block w-full px-3 py-2 rounded-md text-gray-700"
      />
      <input
        type="text"
        value={organizationName}
        placeholder="Organization Name"
        onChange={(e) => setOrganizationName(e.target.value)}
        className="block w-full px-3 py-2 rounded-md text-gray-700"
      />
      <div className="flex justify-between">
        <button
          onClick={() => {
            if (isAddingUser) {
              handleAddUser();
            } else {
              handleUpdateUser();
            }
            setEditMode(false);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          {isAddingUser ? "Add User" : "Update User"}
        </button>
        {!isAddingUser && (
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
        User Account
      </h2>
      {web3Address ? (
        <>
          {!userExists || editMode ? (
            renderForm(!userExists)
          ) : (
            <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white">
              <p>Address: {web3Address}</p>
              <p>Name: {newUserName || "N/A"}</p>
              <p>Healthcare Type: {healthcareType || "N/A"}</p>
              <p>Organization: {organizationName || "N/A"}</p>
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4 mr-2"
              >
                Edit Account
              </button>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg mt-4"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Login with MetaMask
        </button>
      )}
    </div>
  );
};

export default UserDetailView;
