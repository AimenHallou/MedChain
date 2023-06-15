// src/pages/assets/[id].tsx
import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  updateAsset,
  transferOwnership,
  shareAsset,
  unshareAsset,
} from "../../redux/slices/assetSlice";

const AssetPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const assets = useSelector((state: RootState) => state.assets);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const asset = assets.find((asset) => asset.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(asset?.title || "");
  const [editedDescription, setEditedDescription] = useState(
    asset?.description || ""
  );
  const [editedContent, setEditedContent] = useState(asset?.content || "");
  const [newOwner, setNewOwner] = useState("");
  const [sharedAddress, setSharedAddress] = useState("");

  if (!asset) {
    return <div>Asset not found</div>;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    dispatch(
      updateAsset({
        id: asset.id,
        title: editedTitle,
        description: editedDescription,
        content: editedContent,
      })
    );

    setIsEditing(false);
  };

  const handleTransfer = () => {
    dispatch(transferOwnership({ assetId: asset.id, newOwner }));
    setNewOwner("");
  };

  const handleShare = () => {
    dispatch(shareAsset({ assetId: asset.id, address: sharedAddress }));
    setSharedAddress("");
  };

  const handleUnshare = (address: string) => {
    dispatch(unshareAsset({ assetId: asset.id, address }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-800 text-white shadow-md rounded-md overflow-hidden md:max-w-3xl m-4 border-2 border-gray-600">
      <div className="px-4 py-2 flex md:flex-row flex-col">
        <div className="md:w-2/3 w-full">
          <h1 className="text-lg font-bold text-white">{asset.title}</h1>
          <p className="text-sm text-white">Description: {asset.description}</p>
          <p className="text-sm text-white">Owner: {asset.owner}</p>
          <p className="text-sm text-white">Title: {asset.ownerTitle}</p>
          <p className="text-sm text-white">
            Created Date: {asset.createdDate}
          </p>
          {asset.sharedWith.includes(user.address) && (
            <p className="text-sm text-white">Data: {asset.content}</p>
          )}
        </div>
        {user.address === asset.owner && !isEditing && (
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
              {asset.sharedWith.map((address, index) => (
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
        )}
      </div>
      {user.address === asset.owner && !isEditing && (
        <div className="px-4 py-2 bg-gray-900 flex justify-center">
          <button
            className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleEdit}
          >
            Edit
          </button>
        </div>
      )}
      <div className="px-4 py-2 bg-gray-900">
        <h2 className="text-lg font-bold text-white">Asset History</h2>
        {asset.history.map((entry, index) => (
          <p key={index} className="text-sm text-white">
            {entry}
          </p>
        ))}
      </div>
      {isEditing && (
        <div className="px-4 py-2 bg-gray-900">
          <div className="mb-4">
            <label htmlFor="editedTitle" className="text-white font-bold">
              Title
            </label>
            <input
              id="editedTitle"
              name="editedTitle"
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-3 py-2 text-white placeholder-white bg-gray-700 rounded outline-none focus:bg-gray-600"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="editedDescription" className="text-white font-bold">
              Description
            </label>
            <input
              id="editedDescription"
              name="editedDescription"
              type="text"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full px-3 py-2 text-white placeholder-white bg-gray-700 rounded outline-none focus:bg-gray-600"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="editedContent" className="text-white font-bold">
              Content
            </label>
            <input
              id="editedContent"
              name="editedContent"
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-3 py-2 text-white placeholder-white bg-gray-700 rounded outline-none focus:bg-gray-600"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full px-3 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default AssetPage;
