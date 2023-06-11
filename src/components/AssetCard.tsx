// src/components/AssetCard.tsx
import React, { FC } from 'react';
import Link from 'next/link';

interface AssetCardProps {
  image: string;
  title: string;
  description: string;
  price: string;
  id: string; // Assuming each asset has a unique ID
}

const AssetCard: FC<AssetCardProps> = ({ image, title, description, price, id }) => {
  return (
    <div>
      <Link href={`/assets/${id}`}>
        <a style={{ textDecoration: 'none', color: 'inherit' }}>
          <div>
            <img src={image} alt={title} />
            <h2>{title}</h2>
            <p>{description}</p>
            <p>{price}</p>
          </div>
        </a>
      </Link>
    </div>
  );
}

export default AssetCard;
