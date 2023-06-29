// src/components/PatientFileSection.tsx
import React from 'react';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { FileData } from '../../objects/types';
import {AiFillFileText} from 'react-icons/ai';

type PatientFileSectionProps = {
  patientId: string;
};

const PatientFileSection: React.FC<PatientFileSectionProps> = ({ patientId }) => {
  const patient = useSelector((state: RootState) => state.patients);
  const currentPatient = patient.find((patient) => patient.id === patientId);

  if (!currentPatient) return null;

  const renderFileCards = (patientFiles: FileData[]) => {
    return patientFiles.map((file, index) => (
      <div key={index} className="file-card mt-2 flex flex-col items-center rounded p-4">
        <AiFillFileText className="file-image w-20 h-20"/>
        <div className="text-white font-bold mt-4 text-center">
          {file.name}
        </div>
      </div>
    ));
  };

  return (
    <div className="patient-file-section">
      <h2 className="text-center text-2xl font-bold text-white mb-4">
        Attached Files
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentPatient.content && renderFileCards(currentPatient.content)}
      </div>
    </div>
  );
};

export default PatientFileSection;
