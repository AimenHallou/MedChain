// src/components/UserAccount.tsx
import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, addUser } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";
import PublishedPatients from "./PublishedPatient";
import AccessedPatients from "./AccessedPatients";

const UserAccount: FC = () => {
  const dispatch = useDispatch();
  const { users, currentUserAddress } = useSelector((state: RootState) => state.user);

  const [newUserAddress, setNewUserAddress] = useState("");
  const [newUserTitle, setNewUserTitle] = useState("");
  const [showSection, setShowSection] = useState("published");

  const currentUser = users.find(user => user.address === currentUserAddress);
  
  const handleNewUserAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUserAddress(event.target.value);
  };

  const handleNewUserTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUserTitle(event.target.value);
  };

  const handleAddUser = () => {
    dispatch(addUser({ address: newUserAddress, title: newUserTitle, notifications: [] }));
    dispatch(setCurrentUser(newUserAddress));
    setNewUserAddress("");
    setNewUserTitle("");
  };

  const handleSwitchUser = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCurrentUser(event.target.value));
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-4">
      <div className="bg-gray-700 p-6 rounded mt-10 text-white lg:w-[30rem] border-2 border-gray-600">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">User Account</h2>
        </div>
        <div className="mb-4">

          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Add User</h2>
            <input
              type="text"
              value={newUserAddress}
              placeholder="Address"
              onChange={handleNewUserAddressChange}
              className="block bg-gray-800 placeholder-gray-400 text-white border border-gray-600 rounded p-2 w-full mb-4"
            />
            <input
              type="text"
              value={newUserTitle}
              placeholder="Title"
              onChange={handleNewUserTitleChange}
              className="block bg-gray-800 placeholder-gray-400 text-white border border-gray-600 rounded p-2 w-full mb-4"
            />
            <button
              onClick={handleAddUser}
              className="block bg-blue-500 text-white py-2 px-4 rounded"
            >
              Add User
            </button>
          </div>
        </div>
        <div className="mb-4">
          <div className="flex justify-center gap-x-10 mb-4">
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
        {users.length > 0 && (
      <div className="bg-gray-700 p-4 rounded mt-10 text-white lg:w-[20rem] border-2 border-gray-600">
      <h2 className="flex text-2xl justify-center font-bold mb-2">Switch User</h2>
            <select value={currentUserAddress || ''} onChange={handleSwitchUser} className="block bg-gray-800 text-white border border-gray-600 rounded p-2 w-full mb-4">
              {users.map((user) => (
                <option key={user.address} value={user.address}>
                  {user.title} ({user.address})
                </option>
              ))}
            </select>
          </div>
        )}
        
      </div>
    );  
  };
  
  export default UserAccount;
