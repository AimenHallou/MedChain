// src/components/pages/AssetRequestAccess.tsx
import React, { FC } from "react";

interface AssetRequestAccessProps {
  handleRequestAccess: () => void;
}

const AssetRequestAccess: FC<AssetRequestAccessProps> = ({ handleRequestAccess }) => (
  <div className="mt-4">
    <button
      className="text-white bg-blue-500 hover:bg-blue-700 text-sm font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      onClick={handleRequestAccess}
    >
      Request Access
    </button>
  </div>
);

export default AssetRequestAccess;
