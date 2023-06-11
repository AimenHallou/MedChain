// src/components/AssetCard.tsx
import React, { FC } from 'react';
import { useRouter } from 'next/router';

interface AssetCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  id: string; // Assuming each asset has a unique ID
}

const AssetCard: FC<AssetCardProps> = ({ image, title, description, price, id }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/assets/${id}`);
  };

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer' }}>
      <a style={{ textDecoration: 'none', color: 'inherit' }}>
        <div>
          <img src={image} alt={title} />
          <h2>{title}</h2>
          <p>{description}</p>
          <p>{price}</p>
        </div>
      </a>
    </div>
  );
}

export default AssetCard;
