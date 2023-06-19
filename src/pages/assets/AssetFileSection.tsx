import React from 'react';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { FileData } from '../../objects/types';

const AssetFileSection: React.FC = () => {
  const assets = useSelector((state: RootState) => state.assets);

  const renderFileCards = (assetFiles: FileData[]) => {
    return assetFiles.map((file, index) => (
      <div key={index} className="file-card mt-2 flex flex-col items-center rounded p-4">
        <img src="/images/files.png" alt="File" className="file-image w-20 h-20"/>
        <label className="block text-white font-bold mb-2 mt-4">
          File {index + 1} name:
        </label>
        <div className="file-name-input w-3/4 px-3 py-2 text-white bg-gray-700 rounded outline-none">
          {file.name}
        </div>
      </div>
    ));
  };

  const renderAssetFiles = () => {
    return assets.map((asset, index) => (
      <div key={index}>
        <h3 className="text-center text-xl font-bold text-white mb-2">
          Asset {index + 1} Files:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {asset.content && renderFileCards(asset.content)}
        </div>
      </div>
    ));
  };

  return (
    <div className="asset-file-section">
      <h2 className="text-center text-2xl font-bold text-white mb-4">
        Attached Files
      </h2>
      {renderAssetFiles()}
    </div>
  );
};

export default AssetFileSection;
