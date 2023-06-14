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
    <div>
      <h1>{asset.title}</h1>
      <p>Description: {asset.description}</p>
      <p>Owner: {asset.owner}</p>
      <p>Created Date: {asset.createdDate}</p>
      <p>Price: {asset.price}</p>
      {(!asset.restricted || asset.sharedWith.includes(user.username)) && <p>Data: {asset.content}</p>}
      {user.username === asset.owner && !isEditing && (
        <>
          <div>
            <button onClick={handleEdit}>Edit</button>
            <input
              type="text"
              placeholder="Enter new owner's username"
              value={newOwner}
              onChange={(e) => setNewOwner(e.target.value)}
            />
            <button onClick={handleTransfer}>Transfer Ownership</button>
            <input
              type="text"
              placeholder="Enter username to share with"
              value={sharedUsername}
              onChange={(e) => setSharedUsername(e.target.value)}
            />
            <button onClick={handleShare}>Share Asset</button>
          </div>
          <div>
            {asset.sharedWith.map((username, index) => (
              <div key={index}>
                <span>{username}</span>
                <button onClick={() => handleUnshare(username)}>X</button>
              </div>
            ))}
          </div>
        </>
      )}
      <div>
        <h2>Asset History</h2>
        {asset.history.map((entry, index) => (
          <p key={index}>{entry}</p>
        ))}
      </div>
      {isEditing && (
        <div>
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
