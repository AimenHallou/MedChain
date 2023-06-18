// src/components/HomePage.tsx
import React, { FC } from "react";
import AssetList from "./AssetList";

interface HomePageProps {
  searchTerm: string;
}

const HomePage: FC<HomePageProps> = ({ searchTerm }) => {
  return (
    <div>
      <AssetList searchTerm={searchTerm} />
    </div>
  );
};

export default HomePage;
