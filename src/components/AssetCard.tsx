// src/components/AssetCard.tsx
import React, { FC } from 'react';

interface AssetCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
}

const AssetCard: FC<AssetCardProps> = ({ image, title, description, price }) => {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '5px', padding: '1em', margin: '1em' }}>
      <img src={image} alt={title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <h2>{title}</h2>
      <p>{description}</p>
      <p>{price}</p>
    </div>
  );
}

export default AssetCard;
