import React, { FC } from 'react';
import AssetCard from './AssetCard';
import { Asset, AssetListProps } from '../objects/types'

const AssetList: FC<AssetListProps> = ({ assets }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      {assets && assets.map((asset: Asset) => (
        <AssetCard key={asset.id} {...asset} />
      ))}
    </div>
  );
};

export default AssetList;
