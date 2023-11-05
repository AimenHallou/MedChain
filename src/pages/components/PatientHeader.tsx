// src/page/components/EntityHeader.tsx
import React, { FC } from "react";

interface EntityHeaderProps {
  entityId: string;
  owner: string;
  ownerTitle: string;
  createdDate: string;
  entityType: 'Patient' | 'Dataset';
}

const EntityHeader: FC<EntityHeaderProps> = ({
  entityId,
  owner,
  ownerTitle,
  createdDate,
  entityType
}) => (
  <div className="flex justify-between items-center text-white px-6 py-4">
    <div>
      <h2 className="text-2xl font-bold">{entityType}: {entityId}</h2>
      <p className="text-sm text-gray-300">{ownerTitle} {owner.substring(0, 20)}...</p>
      <p className="text-sm text-gray-300">{createdDate}</p>
    </div>
  </div>
);

export default EntityHeader;
