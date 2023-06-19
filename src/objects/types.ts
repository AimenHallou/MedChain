// src/objects/types.ts
export interface FileData {
  base64: string;
  name: string;
}

export interface Asset {
  id: string;
  title: string;
  description: string;
  owner: string;
  ownerTitle: string;
  createdDate: string;
  content: FileData[] | null;
  sharedWith: string[];
  history: string[];
  accessRequests?: string[];
}

export interface AssetListProps {
  assets: Asset[];
}

export interface UserNotification {
  id: string;
  read: boolean;
  message: string;
  accepted?: boolean;
  rejected?: boolean;
}

export interface User {
  address: string;
  title: string;
  notifications: UserNotification[];
}

export interface UsersState {
  users: User[];
  currentUserAddress: string | null;
}

export interface AssetsState {
  assets: Asset[];
}
