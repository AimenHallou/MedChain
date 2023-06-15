// src/pages/assets/[id].tsx
import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  updateAsset,
  transferOwnership,
  shareAsset,
  unshareAsset,
  requestAccess,
} from "../../redux/slices/assetSlice";
import AssetEditForm from "../../pages/assets/AssetEditForm";
import AssetOwnerActions from "../../pages/assets/AssetOwnerActions";
import AssetHistory from "../../pages/assets/AssetHistory";
import AssetRequestAccess from "../../pages/assets/AssetRequestAccess";
import { addNotification } from "../../redux/slices/userSlice";
import { v4 as uuid } from "uuid";

const AssetPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const assets = useSelector((state: RootState) => state.assets);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const asset = assets.find((asset) => asset.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [sharedAddress, setSharedAddress] = useState("");
  const currentUserAddress = useSelector((state: RootState) => state.user.currentUserAddress);

  useEffect(() => {
    if (asset) {
      setEditedTitle(asset.title);
      setEditedDescription(asset.description);
      setEditedContent(asset.content);
    }
  }, [asset]);

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

  const handleRequestAccess = () => {
    const requestPending = asset.accessRequests.includes(currentUserAddress);

    if (!requestPending) {
      dispatch(
        addNotification({
          address: asset.owner,
          notification: {
            id: uuid(),
            read: false,
            message: `User ${currentUserAddress} has requested access to your asset titled "${asset.title}".`,
          },
        })
      );
      dispatch(
        requestAccess({ assetId: asset.id, requestor: currentUserAddress })
      );
    }
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
          {(asset.sharedWith.includes(user.currentUserAddress) ||
            user.currentUserAddress === asset.owner) && (
            <p className="text-sm text-white">Data: {asset.content}</p>
          )}
        </div>
        {user.currentUserAddress !== asset.owner &&
          !asset.sharedWith.includes(user.currentUserAddress) && (
            <div className="px-4">
              <AssetRequestAccess
                handleRequestAccess={handleRequestAccess}
                requestPending={asset.accessRequests.includes(
                  currentUserAddress
                )}
              />
            </div>
          )}
      </div>
      {user.currentUserAddress === asset.owner && !isEditing && (
        <AssetOwnerActions
          isEditing={isEditing}
          newOwner={newOwner}
          setNewOwner={setNewOwner}
          handleTransfer={handleTransfer}
          sharedAddress={sharedAddress}
          setSharedAddress={setSharedAddress}
          handleShare={handleShare}
          sharedWith={asset.sharedWith}
          handleUnshare={handleUnshare}
        />
      )}
      <AssetHistory history={asset.history} />
      {isEditing && (
        <AssetEditForm
          editedTitle={editedTitle}
          setEditedTitle={setEditedTitle}
          editedDescription={editedDescription}
          setEditedDescription={setEditedDescription}
          editedContent={editedContent}
          setEditedContent={setEditedContent}
          handleSave={handleSave}
        />
      )}
    </div>
  );
};

export default AssetPage;
