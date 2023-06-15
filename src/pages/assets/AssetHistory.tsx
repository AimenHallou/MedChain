// src/components/pages/AssetHistory.tsx
import React, { FC } from "react";

interface AssetHistoryProps {
  history: string[];
}

const AssetHistory: FC<AssetHistoryProps> = ({ history }) => (
  <div className="px-4 py-2 bg-gray-900">
    <h2 className="text-lg font-bold text-white">Asset History</h2>
    {history.map((entry, index) => (
      <p key={index} className="text-sm text-white">
        {entry}
      </p>
    ))}
  </div>
);

export default AssetHistory;
