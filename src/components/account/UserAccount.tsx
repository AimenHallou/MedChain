// src/components/account/UserAccount.tsx

import React, { FC, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  setCurrentUser,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../redux/slices/userSlice";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../app/hook";
import Web3 from "web3";

import NotLoggedInView from "../account/NotLoggedInView";
import PatientDetailView from "../account/PatientDetailView";
import UserDetailView from "../account/UserDetailView";

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
      .then((fetchedUsers) => {
        console.log("Fetched Userss:", fetchedUsers);
      })
      .then(() => {
        console.log("Current User Address:", currentUserAddress);
        const existingUser = users.find(
          (user) => user.address === currentUserAddress
        );
        if (existingUser) {
          setNewUserName(existingUser.name);
          setHealthcareType(existingUser.healthcareType);
          setOrganizationName(existingUser.organizationName);
          setWeb3Address(currentUserAddress);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch users:", error);
      });
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

  const handleLogin = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWeb3Address(accounts[0]);
        const existingUser = users.find((user) => user.address === accounts[0]);
        dispatch(setCurrentUser(accounts[0]));
        if (existingUser) {
          dispatch(setCurrentUser(accounts[0]));
          setNewUserName(existingUser.name);
          setHealthcareType(existingUser.healthcareType);
          setOrganizationName(existingUser.organizationName);
        } else {
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

  const handleUpdateUser = () => {
    if (web3Address && newUserName) {
      dispatch(
        updateUser({
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

  const handleLogout = () => {
    setWeb3Address(null);
    dispatch(setCurrentUser(null));
    setNewUserName("");
    setHealthcareType("");
    setOrganizationName("");
  };

  const handleDeleteUser = () => {
    if (web3Address) {
      console.log(`Deleting user with address: ${web3Address}`);
      dispatch(deleteUser(web3Address));

      setWeb3Address(null);
      dispatch(setCurrentUser(null));
      setNewUserName("");
      setHealthcareType("");
      setOrganizationName("");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-4">
      <div className="bg-gray-700 p-6 rounded mt-10 text-white lg:w-[30rem] border-2 border-gray-600">
        {!web3Address && !currentUserAddress && (
          <NotLoggedInView handleLogin={handleLogin} />
        )}
        {currentUserAddress && (
          <UserDetailView
            web3Address={web3Address}
            userExists={userExists}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
            handleAddUser={handleAddUser}
            handleUpdateUser={handleUpdateUser}
            handleDeleteUser={handleDeleteUser}
            newUserName={newUserName}
            setNewUserName={setNewUserName}
            healthcareType={healthcareType}
            setHealthcareType={setHealthcareType}
            organizationName={organizationName}
            setOrganizationName={setOrganizationName}
          />
        )}

        {web3Address && userExists && (
          <PatientDetailView
            showSection={showSection}
            setShowSection={setShowSection}
          />
        )}
      </div>
    </div>
  );
};

export default UserAccount;
