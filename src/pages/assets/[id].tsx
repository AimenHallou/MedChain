import React, { FC } from 'react';
import { useRouter } from 'next/router';
import testAssets from '../../data/testAssets';
import { Asset } from '../../objects/types'

const AssetPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const asset = testAssets.find((asset: Asset) => asset.id === id);

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
