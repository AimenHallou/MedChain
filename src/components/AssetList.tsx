// src/components/AssetList.tsx
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import AssetCard from './AssetCard';
import { RootState } from '../redux/store';
import { Asset } from '../objects/types'

const AssetList: FC = () => {
  const assets = useSelector((state: RootState) => state.assets);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'start' }}>
      {assets && assets.map((asset: Asset) => (
        <AssetCard key={asset.id} {...asset} />
      ))}
    </div>
  );
};

export default AssetList;
