// src/components/AssetCard.tsx
import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { Asset } from '../objects/types'

interface AssetCardProps extends Asset {}

const AssetCard: FC<AssetCardProps> = ({ title, description, owner, createdDate, price, id }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/assets/${id}`);
  };

  return (
    <div onClick={handleClick} className="cursor-pointer w-full max-w-xs mx-auto bg-white shadow-md rounded-md overflow-hidden md:max-w-2xl m-4 border-2 border-blue-900">
      <div className="px-4 py-2">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="px-4 py-2 bg-white">
        <p className="text-sm text-gray-700">Description: {description}</p>
        <p className="text-sm text-gray-700">Owner: {owner}</p>
        <p className="text-sm text-gray-700">Created Date: {createdDate}</p>
        <p className="text-sm text-gray-700">Price: {price}</p>
      </div>
    </div>
  );
};

export default AssetCard;
