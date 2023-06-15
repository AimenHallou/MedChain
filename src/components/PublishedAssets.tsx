// src/components/PublishedAssets.tsx
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AssetCard from './AssetCard';

const PublishedAssets: FC = () => {
  const { address } = useSelector((state: RootState) => state.user);
  const assets = useSelector((state: RootState) => state.assets);

  const publishedAssets = assets.filter(asset => asset.owner === address);

  return (
    <div>
      <h2>Published Assets</h2>
      {publishedAssets.map((asset) => (
        <AssetCard key={asset.id} {...asset} />
      ))}
    </div>
  );
};

export default PublishedAssets;
