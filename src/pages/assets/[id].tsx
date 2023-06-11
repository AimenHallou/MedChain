// pages/assets/[id].tsx
import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface Asset {
  image: string;
  title: string;
  description: string;
  price: string;
}

const AssetPage: FC = () => {
  const router = useRouter();
  const { id } = router.query; // This assumes your URL structure is something like /assets/:id
  const [asset, setAsset] = useState<Asset | null>(null);

  useEffect(() => {
    if (id) {
      // Fetch the asset data based on the ID and set it to state
      // This is just a placeholder, replace it with your actual data fetching logic
      fetch(`/api/assets/${id}`)
        .then(response => response.json())
        .then(data => setAsset(data))
        .catch(error => console.error(error));
    }
  }, [id]);

  if (!asset) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <img src={asset.image} alt={asset.title} />
      <h1>{asset.title}</h1>
      <p>{asset.description}</p>
      <p>{asset.price}</p>
    </div>
  );
}

export default AssetPage;
