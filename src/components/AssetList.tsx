import React, { FC } from "react";
import { useSelector } from "react-redux";
import AssetCard from "./AssetCard";
import { RootState } from "../redux/store";
import { Asset } from "../objects/types";

interface AssetListProps {
  searchTerm: string;
}

const AssetList: FC<AssetListProps> = ({ searchTerm }) => {
  const assets = useSelector((state: RootState) => state.assets);
  const filteredAssets = assets.filter(asset =>
    asset.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-8">Assets</h1>
      <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets &&
          filteredAssets.map((asset: Asset) => <AssetCard key={asset.id} {...asset} />)}
      </div>
    </div>
  );
};

export default AssetList;
