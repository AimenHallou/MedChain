// src/components/PatientFileSection.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { FileData } from '../../objects/types';
import {AiFillFileText} from 'react-icons/ai';
import { removeFile } from '../../redux/slices/patientSlice';
import { TiDelete } from 'react-icons/ti';

type PatientFileSectionProps = {
  patientId: string;
};

const PatientFileSection: React.FC<PatientFileSectionProps> = ({ patientId }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUserAddress);
  const patient = useSelector((state: RootState) => state.patients);
  const currentPatient = patient.find((patient) => patient.id === patientId);

  const handleRemoveFile = (fileName: string) => {
    if (currentUser === currentPatient?.owner) {
      dispatch(removeFile({patientId, fileName}));
    }
  }
  

  if (!currentPatient) return null;

  return (
    <div className="">
      <h2 className="text-center text-2xl font-bold text-white my-4">
        Attached Files
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentPatient.content && currentPatient.content.map((file, index) => (
          <div key={index} className="file-card mt-2 flex flex-col items-center rounded p-4 relative">
            <AiFillFileText className="file-image w-20 h-20 text-blue-500"/>
            {currentUser === currentPatient.owner && 
              <TiDelete className="absolute right-2 top-2 h-8 w-8 cursor-pointer text-red-500" onClick={() => handleRemoveFile(file.name)}/>
            }
            <div className="text-white font-bold text-center">
              {file.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientFileSection;
