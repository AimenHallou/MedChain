// src/components/PatientHeader.tsx
import React, { FC } from "react";

interface PatientHeaderProps {
  Patient_id: string;
  owner: string;
  ownerTitle: string;
  createdDate: string;
}

const PatientHeader: FC<PatientHeaderProps> = ({
  Patient_id,
  owner,
  ownerTitle,
  createdDate,
}) => (
  <div className="flex justify-between items-center text-white px-6 py-4">
    <div>
      <h2 className="text-2xl font-bold">{Patient_id}</h2>
      <p className="text-sm text-gray-300">{ownerTitle} {owner.substring(0, 20)}...</p>
      <p className="text-sm text-gray-300">{createdDate}</p>
    </div>
  </div>
);

export default PatientHeader;
