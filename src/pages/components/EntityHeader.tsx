// src/page/components/EntityHeader.tsx
import React, { FC } from "react";

interface EntityHeaderProps {
  entityId: string;
  owner: string;
  healthcareType: string;
  organizationName: string;
  createdDate: string;
  entityType: 'Patient' | 'Dataset';
}

const EntityHeader: FC<EntityHeaderProps> = ({
  entityId,
  owner,
  healthcareType,
  organizationName,
  createdDate,
  entityType
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-center text-white px-6 py-4 rounded-t-lg">
    <div>
      <h2 className="text-2xl font-bold">{entityType}: {entityId}</h2>
      <p className="text-sm text-gray-400 mt-1">{healthcareType} at {organizationName}</p>
      <p className="text-sm text-gray-400 mt-1">Owned by: {owner ? `${owner.substring(0, 20)}...` : 'Unavailable'}</p>
    </div>
    <div className="mt-4 sm:mt-0">
      <p className="text-sm text-gray-400">Created on: {createdDate ? createdDate.substring(0, 10) : 'Unavailable'}</p>
    </div>
  </div>
);

export default EntityHeader;
