// src/components/account/UserDetailView.tsx

import React from "react";

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
}) => {
  return (
    <>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold">User Account</h2>
      </div>
      <div className="mb-4">
        {web3Address && !userExists && (
          <>
            <p className="text-lg mb-4 text-gray-300">
              Please enter your account details:
            </p>
          </>
        )}
        <div className="mb-4">
          <div className="font-bold mb-2">{web3Address || "N/A"}</div>
          <div className="font-bold mb-2">{newUserName || "N/A"}</div>
          <div className="font-bold mb-2">{healthcareType || "N/A"}</div>
          <div className="font-bold mb-2">{organizationName || "N/A"}</div>
          {web3Address && !userExists && (
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
            </>
          )}
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
      </div>
    </>
  );
};

export default UserDetailView;
