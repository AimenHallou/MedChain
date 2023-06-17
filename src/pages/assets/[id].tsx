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
  acceptAccessRequest,
  rejectAccessRequest,
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
  const [editedContent, setEditedContent] = useState(
    new File([""], "filename")
  );
  const [newOwner, setNewOwner] = useState("");
  const [sharedAddress, setSharedAddress] = useState("");
  const currentUserAddress = useSelector(
    (state: RootState) => state.user.currentUserAddress
  );

  useEffect(() => {
    if (asset) {
      setEditedTitle(asset.title);
      setEditedDescription(asset.description);
      if (typeof asset.content === "string") {
        let decodedData = Buffer.from(asset.content, "base64");
        setEditedContent(new File([new Blob([decodedData])], "filename"));
      } else {
        setEditedContent(asset.content);
      }
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
        requestAccess({ assetId: asset.id, requestor: currentUserAddress })
      );
      dispatch(
        addNotification({
          address: asset.owner,
          notification: {
            id: uuid(),
            read: false,
            message: `${currentUserAddress} has requested access to asset ${asset.title}`,
          },
        })
      );
    }
  };

  const handleAcceptRequest = (requestor: string) => {
    dispatch(acceptAccessRequest({ assetId: asset.id, requestor }));
    dispatch(
      addNotification({
        address: requestor,
        notification: {
          id: uuid(),
          read: false,
          message: `Your access request to asset ${asset.title} has been accepted`,
        },
      })
    );
  };

  const handleRejectRequest = (requestor: string) => {
    dispatch(rejectAccessRequest({ assetId: asset.id, requestor }));
    dispatch(
      addNotification({
        address: requestor,
        notification: {
          id: uuid(),
          read: false,
          message: `Your access request to asset ${asset.title} has been rejected`,
        },
      })
    );
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
            <p className="text-sm text-white">Data: [File Content]</p>
          )}
        </div>
        <div className="md:w-1/3 w-full px-4">
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
          <h3 className="text-lg font-bold text-white mt-4">Request List:</h3>
          <AssetRequestAccess
            assetId={id as string}
            handleRequestAccess={handleRequestAccess}
            requestPending={asset.accessRequests.includes(currentUserAddress)}
            accessRequests={asset.accessRequests}
            handleAcceptRequest={handleAcceptRequest}
            handleRejectRequest={handleRejectRequest}
            currentUserAddress={currentUserAddress}
            assetOwner={asset.owner}
          />
        </div>
      </div>
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
