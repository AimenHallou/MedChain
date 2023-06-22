// src/components/pages/PatientHeader.tsx
import React, { FC } from "react";

interface PatientHeaderProps {
  title: string;
  owner: string;
  ownerTitle: string;
  createdDate: string;
  content: string;
  currentUserAddress: string;
  sharedWith: string[];
}

const PatientHeader: FC<PatientHeaderProps> = ({
  title,
  owner,
  ownerTitle,
  createdDate,
  content,
  currentUserAddress,
  sharedWith,
}) => (
  <div className="md:w-2/3 w-full">
    <h1 className="text-lg font-bold text-white">{title}</h1>
    <p className="text-sm text-white">Owner: {owner}</p>
    <p className="text-sm text-white">Title: {ownerTitle}</p>
    <p className="text-sm text-white">Created Date: {createdDate}</p>
    {(sharedWith.includes(currentUserAddress) || currentUserAddress === owner) && (
      <p className="text-sm text-white">Data: {content}</p>
    )}
  </div>
);

export default PatientHeader;
