// src/pages/assets/[id].tsx
import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const AssetPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const assets = useSelector((state: RootState) => state.assets);
  const asset = assets.find((asset) => asset.id === id);

  if (!asset) {
    return <div>Asset not found</div>;
  }

  return (
    <div>
      <h1>{asset.title}</h1>
      <p>{asset.description}</p>
      <p>Owner: {asset.owner}</p>
      <p>Created Date: {asset.createdDate}</p>
      <p>{asset.price}</p>
    </div>
  );
};

export default AssetPage;
