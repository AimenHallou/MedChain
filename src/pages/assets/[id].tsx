// pages/assets/[id].tsx
import React, { FC } from 'react';
import { useRouter } from 'next/router';
import testAssets from '../../data/testAssets'; // Adjust the import path accordingly

interface Asset {
  image: string;
  title: string;
  description: string;
  price: string;
}

const AssetPage: FC = () => {
  const router = useRouter();
  const { id } = router.query; // This assumes your URL structure is something like /assets/:id

  // Find the asset directly
  const asset = testAssets.find(asset => asset.id === id);

  // If there's no matching asset, return an error message
  if (!asset) {
    return <div>Asset not found</div>;
  }

  return (
    <div>
      <img src={asset.image} alt={asset.title} />
      <h1>{asset.title}</h1>
      <p>{asset.description}</p>
      <p>{asset.price}</p>
    </div>
  );
}

export default AssetPage;
