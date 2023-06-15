// src/components/AssetCard.tsx
import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { Asset } from '../objects/types'

interface AssetCardProps extends Asset {}

const AssetCard: FC<AssetCardProps> = ({ title, description, owner, ownerTitle, createdDate, id }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/assets/${id}`);
  };

  return (
    <div 
      onClick={handleClick} 
      className="cursor-pointer w-80 bg-gray-800 text-white shadow-md rounded-md overflow-hidden my-2 mx-4 border-2 border-gray-600 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-100"
    >
      <div className="px-4 py-2">
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      <div className="px-4 py-2 bg-gray-900">
        <p className="text-sm text-white">Description: {description}</p>
        <p className="text-sm text-white">Owner: {owner}</p>
        <p className="text-sm text-white">Created Date: {createdDate}</p>
      </div>
    </div>
  );
};

export default AssetCard;
