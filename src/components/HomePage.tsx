// src/components/HomePage.tsx
import React, { FC } from 'react';
import AssetList from './AssetList';
import testAssets from '../data/testAssets';

const HomePage: FC = () => {
  return (
    <div>
      <h1>Welcome to MedChain</h1>
      <AssetList assets={testAssets} />
    </div>
  );
}

export default HomePage;
