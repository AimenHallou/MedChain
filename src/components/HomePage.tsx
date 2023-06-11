// src/components/HomePage.tsx
import React, { FC } from 'react';
import AssetList from './AssetList';
const testAssets = [
  {
    id: '1',
    image: "https://via.placeholder.com/150",
    title: "Patient Medical Record 1",
    description: "This is a comprehensive medical record for patient 1, including medical history, diagnoses, treatments, and more.",
    price: "0.1 ETH",
  },
  {
    id: '2',
    image: "https://via.placeholder.com/150",
    title: "Patient Medical Record 2",
    description: "This is a comprehensive medical record for patient 2, including medical history, diagnoses, treatments, and more.",
    price: "0.2 ETH",
  },
  {
    id: '3',
    image: "https://via.placeholder.com/150",
    title: "Patient Medical Record 3",
    description: "This is a comprehensive medical record for patient 3, including medical history, diagnoses, treatments, and more.",
    price: "0.15 ETH",
  },
];



const HomePage: FC = () => {
  return (
    <div>
      <h1>Welcome to MedChain</h1>
      <AssetList assets={testAssets} />
    </div>
  );
}

export default HomePage;
