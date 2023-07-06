// src/components/PatientFileSection.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { AiFillFileText } from "react-icons/ai";
import { removeFile } from "../../redux/slices/patientSlice";
import { TiDelete} from "react-icons/ti";
import { BiSolidEditAlt } from "react-icons/Bi";

type PatientFileSectionProps = {
  patientId: string;
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  selectedRequestor: string | null;
  selectedUsers: string | null;
};

const PatientFileSection: React.FC<PatientFileSectionProps> = ({
  patientId,
  selectedFiles,
  setSelectedFiles,
  selectedRequestor,
  selectedUsers,
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(
    (state: RootState) => state.user.currentUserAddress
  );
  const patient = useSelector((state: RootState) => state.patients);
  const currentPatient = patient.find((patient) => patient.id === patientId);

  const handleRemoveFile = (fileName: string) => {
    if (currentUser === currentPatient?.owner) {
      dispatch(removeFile({ patientId, fileName }));
    }
  };

  const [editing, setEditing] = useState(false);

  if (!currentPatient) return null;

  const isOwner = currentUser === currentPatient.owner;
  const accessibleFiles = isOwner
    ? currentPatient.content?.map((file) => file.name)
    : currentPatient.sharedWith[currentUser] || [];

    return (
      <div className="bg-gray-700 p-4 rounded-lg">
        <div className="flex justify-center items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Attached Files</h2>
          {isOwner && (
            <BiSolidEditAlt
              className="h-6 w-6 cursor-pointer text-white ml-4"
              onClick={() => setEditing(!editing)}
            />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentPatient.content &&
            currentPatient.content
              .filter((file) => accessibleFiles.includes(file.name))
              .map((file, index) => (
                <div
                  key={index}
                  className={`file-card flex flex-col items-center justify-center border-2 border-transparent rounded p-4 relative cursor-pointer ${
                    (selectedRequestor || selectedUsers) &&
                    "hover:border-blue-500 hover:shadow-lg"
                  }`}
                  onClick={() => {
                    if (
                      ((currentUser === currentPatient.owner && selectedUsers) ||
                        selectedRequestor) &&
                      (selectedFiles.includes(file.name))
                    ) {
                      setSelectedFiles(
                        selectedFiles.filter((selectedFile) => selectedFile !== file.name)
                      );
                    } else if (
                      ((currentUser === currentPatient.owner && selectedUsers) ||
                        selectedRequestor) &&
                      !(selectedFiles.includes(file.name))
                    ) {
                      setSelectedFiles([...selectedFiles, file.name]);
                    }
                  }}
                >
                  <AiFillFileText
                    className={`file-image w-20 h-20 ${
                      selectedFiles.includes(file.name) && (selectedRequestor || selectedUsers)
                        ? "text-blue-500"
                        : "text-white"
                    }`}
                  />
                  <div className="text-white font-bold text-center truncate w-full">{file.name}</div>
                  {isOwner && editing && (
                    <TiDelete
                      className="absolute right-2 top-2 h-6 w-6 cursor-pointer text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(file.name);
                      }}
                    />
                  )}
                </div>
              ))}
        </div>
      </div>
    );    
};

export default PatientFileSection;
