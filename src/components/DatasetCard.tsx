// src/components/DatasetCard.tsx
import React, { FC } from "react";
import { useRouter } from "next/router";
import { Dataset } from "../objects/types";
import { BsFillGrid3X3GapFill } from "react-icons/bs"; // Changed the icon to represent a grid/dataset

interface DatasetCardProps extends Dataset {}

const DatasetCard: FC<DatasetCardProps> = ({
  dataset_id,
  owner,
  createdDate,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/datasets/${dataset_id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer w-full bg-gray-800 text-white rounded-lg border-2 border-blue-900 transition 
      duration-200 hover:bg-blue-900 ease-in-out transform hover:scale-105 shadow-lg overflow-hidden flex items-center space-x-4 p-4"
    >
      <div className="flex-grow space-y-2 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold line-clamp-1 overflow-hidden text-main-text">
            {dataset_id}
          </h2>
          <p className="text-sm font-light text-main-text">
            {owner ? owner.substring(0, 20) : "N/A"}...
          </p>
          <p className="text-xs text-sub-text">{createdDate || "N/A"}</p>
        </div>
      </div>
      <BsFillGrid3X3GapFill className="text-blue-500 h-12 w-12 flex-shrink-0" /> {/* Changed the icon */}
    </div>
  );
};

export default DatasetCard;
