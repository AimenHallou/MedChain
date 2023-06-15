// src/components/pages/AssetRequestAccess.tsx
import React, { FC } from "react";

interface AssetRequestAccessProps {
  handleRequestAccess: () => void;
  requestPending: boolean;
}

const AssetRequestAccess: FC<AssetRequestAccessProps> = ({ handleRequestAccess, requestPending }) => (
  <div className="mt-4">
    <button
      className={`text-white text-sm font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${requestPending ? "bg-yellow-500" : "bg-blue-500 hover:bg-blue-700"}`}
      onClick={handleRequestAccess}
      disabled={requestPending}
    >
      {requestPending ? "Request Pending" : "Request Access"}
    </button>
  </div>
);

export default AssetRequestAccess;
