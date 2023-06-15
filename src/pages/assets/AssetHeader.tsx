// src/components/pages/AssetHeader.tsx
import React, { FC } from "react";

interface AssetHeaderProps {
  title: string;
  description: string;
  owner: string;
  ownerTitle: string;
  createdDate: string;
  content: string;
  currentUserAddress: string;
  sharedWith: string[];
}

const AssetHeader: FC<AssetHeaderProps> = ({
  title,
  description,
  owner,
  ownerTitle,
  createdDate,
  content,
  currentUserAddress,
  sharedWith,
}) => (
  <div className="md:w-2/3 w-full">
    <h1 className="text-lg font-bold text-white">{title}</h1>
    <p className="text-sm text-white">Description: {description}</p>
    <p className="text-sm text-white">Owner: {owner}</p>
    <p className="text-sm text-white">Title: {ownerTitle}</p>
    <p className="text-sm text-white">Created Date: {createdDate}</p>
    {(sharedWith.includes(currentUserAddress) || currentUserAddress === owner) && (
      <p className="text-sm text-white">Data: {content}</p>
    )}
  </div>
);

export default AssetHeader;
