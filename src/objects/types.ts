// src/objects/types.ts
export interface Asset {
  id: string;
  title: string;
  description: string;
  owner: string;
  ownerTitle: string;
  createdDate: string;
  content: string;
  sharedWith: string[];
  history: string[];
}

export interface AssetListProps {
  assets: Asset[];
}

export interface UserNotification {
  id: string;
  message: string;
  read: boolean;
}

export interface UserState {
  username: string;
  title: string;
  notifications: UserNotification[];
}
