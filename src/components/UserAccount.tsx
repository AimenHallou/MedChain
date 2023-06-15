import React, { FC, ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddress, setTitle } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";
import PublishedAssets from "../components/PublishedAssets";
import AccessedAssets from "../components/AccessedAssets";

const UserAccount: FC = () => {
  const dispatch = useDispatch();
  const { address, title } = useSelector((state: RootState) => state.user);

  const [showSection, setShowSection] = useState("published");

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setAddress(event.target.value));
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle(event.target.value));
  };

  return (
    <div className="bg-gray-900 p-6 rounded max-w-lg mx-auto mt-10 text-white">
      <h2 className="text-2xl font-bold mb-2">{address}</h2>
      <input
        type="text"
        value={address}
        placeholder="Address"
        onChange={handleAddressChange}
        className="block bg-gray-700 placeholder-white text-white border border-gray-600 rounded p-2 w-full mb-4"
      />
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <input
        type="text"
        value={title}
        placeholder="Title"
        onChange={handleTitleChange}
        className="block bg-gray-700 placeholder-white text-white border border-gray-600 rounded p-2 w-full mb-4"
      />
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
