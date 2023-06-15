// src/components/AccessedAssets.tsx
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AssetCard from './AssetCard';

const AccessedAssets: FC = () => {
  const { address } = useSelector((state: RootState) => state.user);
  const assets = useSelector((state: RootState) => state.assets);

  const accessedAssets = assets.filter(asset => asset.sharedWith.includes(address));

  return (
    <div>
      <h2>Accessed Assets</h2>
      {accessedAssets.map((asset) => (
        <AssetCard key={asset.id} {...asset} />
      ))}
    </div>
  );
};

export default AccessedAssets;
