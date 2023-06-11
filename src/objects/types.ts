// src/objects/types.ts
export interface Asset {
    id: string;
    title: string;
    description: string;
    owner: string;
    createdDate: string;
    price: string;
  }

  export interface AssetListProps {
    assets: Asset[];
  }
  