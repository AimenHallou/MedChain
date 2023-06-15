// src/components/UserAccount.tsx
import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser, addUser } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";
import PublishedAssets from "../components/PublishedAssets";
import AccessedAssets from "../components/AccessedAssets";

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
    <div className="bg-gray-900 p-6 rounded max-w-lg mx-auto mt-10 text-white">
      <h2 className="text-2xl font-bold mb-2">User Account</h2>
      {currentUser && (
        <>
          <h3 className="text-xl mb-2">{currentUser.address}</h3>
          <h3 className="text-xl mb-2">{currentUser.title}</h3>
        </>
      )}

      <h2 className="text-2xl font-bold mb-2">Add User</h2>
      <input
        type="text"
        value={newUserAddress}
        placeholder="Address"
        onChange={handleNewUserAddressChange}
        className="block bg-gray-700 placeholder-white text-white border border-gray-600 rounded p-2 w-full mb-4"
      />
      <input
        type="text"
        value={newUserTitle}
        placeholder="Title"
        onChange={handleNewUserTitleChange}
        className="block bg-gray-700 placeholder-white text-white border border-gray-600 rounded p-2 w-full mb-4"
      />
      <button
        onClick={handleAddUser}
        className="block bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        Add User
      </button>

      {users.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-2">Switch User</h2>
          <select value={currentUserAddress || ''} onChange={handleSwitchUser} className="block bg-gray-700 text-white border border-gray-600 rounded p-2 w-full mb-4">
            {users.map((user) => (
              <option key={user.address} value={user.address}>
                {user.address}
              </option>
            ))}
          </select>
        </>
      )}

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowSection("published")}
          className={`py-2 px-4 rounded ${
            showSection === "published"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-white"
          }`}
        >
          Published Assets
        </button>
        <button
          onClick={() => setShowSection("accessed")}
          className={`py-2 px-4 rounded ${
            showSection === "accessed"
              ? "bg-blue-500 text-white"
              : "bg-gray-700 text-white"
          }`}
        >
          Accessed Assets
        </button>
      </div>

      {showSection === "published" && <PublishedAssets />}
      {showSection === "accessed" && <AccessedAssets />}
    </div>
  );
};

export default UserAccount;
