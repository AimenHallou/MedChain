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
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <a style={{ textDecoration: 'none', color: 'inherit' }}>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
          <p>Owner: {owner}</p>
          <p>Created Date: {createdDate}</p>
          <p>{price}</p>
        </div>
      </a>
    </div>
  );
};

export default AssetCard;
