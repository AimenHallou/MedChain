// src/components/UserAccount.tsx
import React, { FC, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  setCurrentUser,
  fetchUsers,
  createUser,
} from "../redux/slices/userSlice";
import { RootState } from "../redux/store";
import PublishedPatients from "./PublishedPatient";
import AccessedPatients from "./AccessedPatients";
import { useAppDispatch } from "../app/hook";
import Web3 from "web3";

declare global {
  interface Window {
    ethereum: any;
  }
}

const UserAccount: FC = () => {
  const dispatch = useAppDispatch();
  const { users, currentUserAddress } = useSelector(
    (state: RootState) => state.user
  );

  const [showSection, setShowSection] = useState("published");
  const [newUserName, setNewUserName] = useState("");
  const [healthcareType, setHealthcareType] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [web3Address, setWeb3Address] = useState<string | null>(null);
  const userExists = users.some((user) => user.address === web3Address);

  useEffect(() => {
    dispatch(fetchUsers())
      .then(unwrapResult)
      .catch((error) => console.error("Failed to fetch users:", error));
  }, [dispatch]);

  const handleAddUser = () => {
    if (web3Address && newUserName) {
      const userExists = users.some((user) => user.address === web3Address);
      console.log({
        newUserName,
        healthcareType,
        organizationName,
        web3Address,
      });
      if (userExists) {
        console.error(`User with address ${web3Address} already exists.`);
        return;
      }

      dispatch(
        createUser({
          address: web3Address,
          name: newUserName,
          healthcareType: healthcareType,
          organizationName: organizationName,
          notifications: [],
        })
      );
      dispatch(setCurrentUser(web3Address));
    }
  };

  // const handleNewUserTitleChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setNewUserTitle(event.target.value);
  // };

  const handleLogin = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWeb3Address(accounts[0]);

        const existingUser = users.find((user) => user.address === accounts[0]);
        if (existingUser) {
          dispatch(setCurrentUser(accounts[0]));

          setNewUserName(existingUser.name);
          setHealthcareType(existingUser.healthcareType);
          setOrganizationName(existingUser.organizationName);
        }
      } catch (error) {
        if (error.code === 4001) {
          console.error("User denied account access");
        } else {
          console.error(error);
        }
      }
    } else {
      console.error("Ethereum browser not detected. Consider using MetaMask.");
    }
};

  const handleLogout = () => {
    setWeb3Address(null);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-4">
      <div className="bg-gray-700 p-6 rounded mt-10 text-white lg:w-[30rem] border-2 border-gray-600">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">User Account</h2>
        </div>
        <div className="mb-4">
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

            <div className="flex mt-4">
              <button
                onClick={web3Address ? handleLogout : handleLogin}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                {web3Address ? "Logout" : "Login with MetaMask"}
              </button>

              {web3Address && !currentUserAddress && (
                <button
                  onClick={handleAddUser}
                  className="block bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Add User
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-center gap-x-10 mb-4 mt-6">
            <button
              onClick={() => setShowSection("published")}
              className={`py-2 px-2  ${
                showSection === "published"
                  ? "border-b text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              Published Patients
            </button>
            <button
              onClick={() => setShowSection("accessed")}
              className={`py-2 px-2 ${
                showSection === "accessed"
                  ? "border-b  text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              Accessed Patients
            </button>
          </div>
          {showSection === "published" && <PublishedPatients />}
          {showSection === "accessed" && <AccessedPatients />}
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
