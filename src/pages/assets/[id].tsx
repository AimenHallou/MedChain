// src/pages/assets/[id].tsx
import React, { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { updateAsset, transferOwnership, shareAsset, unshareAsset } from '../../redux/slices/assetSlice';

const AssetPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const assets = useSelector((state: RootState) => state.assets);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const asset = assets.find((asset) => asset.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(asset?.title || '');
  const [editedDescription, setEditedDescription] = useState(asset?.description || '');
  const [editedPrice, setEditedPrice] = useState(asset?.price || '');
  const [editedContent, setEditedContent] = useState(asset?.content || '');
  const [editedRestricted, setEditedRestricted] = useState(asset?.restricted || false);
  const [newOwner, setNewOwner] = useState('');
  const [sharedUsername, setSharedUsername] = useState('');

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
        price: editedPrice,
        content: editedContent,
        restricted: editedRestricted,
      })
    );

    setIsEditing(false);
  };

  const handleTransfer = () => {
    dispatch(transferOwnership({ assetId: asset.id, newOwner }));
    setNewOwner('');
  };

  const handleShare = () => {
    dispatch(shareAsset({ assetId: asset.id, username: sharedUsername }));
    setSharedUsername('');
  };

  const handleUnshare = (username: string) => {
    dispatch(unshareAsset({ assetId: asset.id, username }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white shadow-md rounded-md overflow-hidden md:max-w-3xl m-4 border-2 border-blue-900">
    <div className="px-4 py-2 flex md:flex-row flex-col">
      <div className="md:w-2/3 w-full">
        <h1 className="text-lg font-semibold text-gray-800">{asset.title}</h1>
        <p className="text-sm text-gray-700">Description: {asset.description}</p>
        <p className="text-sm text-gray-700">Owner: {asset.owner}</p>
        <p className="text-sm text-gray-700">Created Date: {asset.createdDate}</p>
        <p className="text-sm text-gray-700">Price: {asset.price}</p>
        {(!asset.restricted || asset.sharedWith.includes(user.username)) && <p className="text-sm text-gray-700">Data: {asset.content}</p>}
      </div>
      {user.username === asset.owner && !isEditing && (
        <div className="md:w-1/3 w-full md:ml-4">
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-2"
            type="text"
            placeholder="Enter new owner's username"
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
          />
          <button className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" onClick={handleTransfer}>Transfer Ownership</button>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline my-2"
            type="text"
            placeholder="Enter username to share with"
            value={sharedUsername}
            onChange={(e) => setSharedUsername(e.target.value)}
          />
          <button className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full" onClick={handleShare}>Share Asset</button>
          <div className="py-2">
            {asset.sharedWith.map((username, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{username}</span>
                <button className="text-sm bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline" onClick={() => handleUnshare(username)}>X</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    {user.username === asset.owner && !isEditing && (
      <div className="px-4 py-2 bg-white flex justify-center">
        <button className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleEdit}>Edit</button>
      </div>
    )}
    <div className="px-4 py-2 bg-white">
      <h2 className="text-lg font-semibold text-gray-800">Asset History</h2>
      {asset.history.map((entry, index) => (
        <p key={index} className="text-sm text-gray-700">{entry}</p>
      ))}
    </div>
      {isEditing && (
        <div className="px-4 py-2 bg-white">
        <label htmlFor="editedTitle">Title</label>
          <input
            id="editedTitle"
            name="editedTitle"
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />

          <label htmlFor="editedDescription">Description</label>
          <input
            id="editedDescription"
            name="editedDescription"
            type="text"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
          />

          <label htmlFor="editedPrice">Price</label>
          <input
            id="editedPrice"
            name="editedPrice"
            type="text"
            value={editedPrice}
            onChange={(e) => setEditedPrice(e.target.value)}
          />

          <label htmlFor="editedContent">Content</label>
          <input
            id="editedContent"
            name="editedContent"
            type="text"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />

          <label htmlFor="editedRestricted">
            Restricted
            <input
              id="editedRestricted"
              name="editedRestricted"
              type="checkbox"
              checked={editedRestricted}
              onChange={(e) => setEditedRestricted(e.target.checked)}
            />
          </label>

          <button onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default AssetPage;
