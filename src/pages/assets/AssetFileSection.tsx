// src/components/AssetFileSection.tsx
import React from 'react';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { FileData } from '../../objects/types';

type AssetFileSectionProps = {
  assetId: string;
};

const AssetFileSection: React.FC<AssetFileSectionProps> = ({ assetId }) => {
  const assets = useSelector((state: RootState) => state.assets);
  const currentAsset = assets.find((asset) => asset.id === assetId);

  if (!currentAsset) return null;

  const renderFileCards = (assetFiles: FileData[]) => {
    return assetFiles.map((file, index) => (
      <div key={index} className="file-card mt-2 flex flex-col items-center rounded p-4">
        <img src="/images/files.png" alt="File" className="file-image w-20 h-20"/>
        <div className="text-white font-bold mt-4 text-center">
          {file.name}
        </div>
      </div>
    ));
  };

  return (
    <div className="asset-file-section">
      <h2 className="text-center text-2xl font-bold text-white mb-4">
        Attached Files
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentAsset.content && renderFileCards(currentAsset.content)}
      </div>
    </div>
  );
};

export default AssetFileSection;
