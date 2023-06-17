// AssetRequestAccess.tsx
import React, { FC } from "react";

interface AssetRequestAccessProps {
    assetId: string;
    requestPending: boolean;
    handleRequestAccess: () => void;
    handleAcceptRequest: (requestor: string) => void;
    handleRejectRequest: (requestor: string) => void;
    accessRequests?: string[];
    currentUserAddress: string | null;
    assetOwner: string;
  }  

const AssetRequestAccess: FC<AssetRequestAccessProps> = ({
  assetId,
  requestPending,
  handleRequestAccess,
  handleAcceptRequest,
  handleRejectRequest,
  accessRequests,
  currentUserAddress,
  assetOwner,
}) => (
    <div className="mt-4">
      {currentUserAddress !== assetOwner && (
        <button
          className={`text-white text-sm font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            requestPending ? "bg-yellow-500" : "bg-blue-500 hover:bg-blue-700"
          }`}
          onClick={handleRequestAccess}
          disabled={requestPending}
        >
          {requestPending ? "Request Pending" : "Request Access"}
        </button>
      )}
      {currentUserAddress === assetOwner && accessRequests.map((requestor) => (
        <div key={`${assetId}-${requestor}`} className="flex justify-between items-center">
          <p>{requestor}</p>
          <div>
            <button onClick={() => handleAcceptRequest(requestor)}>
              <img src="/images/check.png" alt="Accept" style={{ width: '40px', height: '40px' }} />
            </button>
            <button onClick={() => handleRejectRequest(requestor)}>
              <img src="/images/close.png" alt="Reject" style={{ width: '30px', height: '30px' }} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

export default AssetRequestAccess;
