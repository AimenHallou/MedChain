// src/components/AssetList.tsx
import React, { FC } from 'react';
import AssetCard from './AssetCard';

interface Asset {
  id: string;
  image: string;
  title: string;
  description: string;
  price: string;
}

interface AssetListProps {
  assets: Asset[];
}

const AssetList: FC<AssetListProps> = ({ assets }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {assets && assets.map((asset, index) => (
        <AssetCard key={index} {...asset} />
      ))}
    </div>
  );
}

export default AssetList;
