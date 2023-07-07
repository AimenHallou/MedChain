// src/components/PatientCard.tsx
import React, { FC } from "react";
import { useRouter } from "next/router";
import { Patient } from "../objects/types";
import { BsFillFilePersonFill } from "react-icons/bs";

interface PatientCardProps extends Patient {}

const PatientCard: FC<PatientCardProps> = ({
  patient_id,
  owner,
  ownerTitle,
  createdDate,
  id,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/patients/${id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer w-full bg-gray-800 text-white rounded-lg border-2 border-blue-900 transition 
      duration-200 ease-in-out transform hover:scale-105 shadow-lg overflow-hidden flex items-center space-x-4 p-4"
    >
      <div className="flex-grow space-y-2 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold line-clamp-1 overflow-hidden">{patient_id}</h2>
          <p className="text-sm font-light">{ownerTitle} {owner}</p>
        </div>
        <p className="text-xs text-gray-400">Created: {createdDate}</p>
      </div>
      <BsFillFilePersonFill className="text-blue-500 h-12 w-12 flex-shrink-0"/>
    </div>
  );  
};

export default PatientCard;
