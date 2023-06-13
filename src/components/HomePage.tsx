// src/components/HomePage.tsx
import React, { FC } from 'react';
import AssetList from './AssetList';

const HomePage: FC = () => {
  return (
    <div>
      <h1>Welcome to MedChain</h1>
      <AssetList/>
    </div>
  );
}

export default HomePage;
