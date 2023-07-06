// src/components/PatientFileSection.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { FileData } from "../../objects/types";
import { AiFillFileText } from "react-icons/ai";
import { removeFile } from "../../redux/slices/patientSlice";
import { TiDelete } from "react-icons/ti";
import { BiCheckbox, BiCheckboxSquare } from "react-icons/Bi";

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

  if (!currentPatient) return null;

  const isOwner = currentUser === currentPatient.owner;
  const accessibleFiles = isOwner
    ? currentPatient.content?.map((file) => file.name)
    : currentPatient.sharedWith[currentUser] || [];

  return (
    <div className="">
      <h2 className="text-center text-2xl font-bold text-white my-4">
        Attached Files
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentPatient.content &&
          currentPatient.content
            .filter((file) => accessibleFiles.includes(file.name))
            .map((file, index) => (
              <div
                key={index}
                className={`file-card mt-2 flex flex-col items-center rounded p-4 relative ${
                  selectedFiles.includes(file.name) && selectedRequestor
                    ? "bg-green-100"
                    : ""
                }`}
              >
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    if (
                      (currentUser === currentPatient.owner && selectedUsers) ||
                      selectedRequestor
                    ) {
                      if (selectedFiles.includes(file.name)) {
                        setSelectedFiles(
                          selectedFiles.filter(
                            (selectedFile) => selectedFile !== file.name
                          )
                        );
                      } else {
                        setSelectedFiles([...selectedFiles, file.name]);
                      }
                    }
                  }}
                >
                  {(currentUser === currentPatient.owner && selectedUsers) ||
                  selectedRequestor ? (
                    selectedFiles.includes(file.name) ? (
                      <BiCheckboxSquare className="w-full h-full" />
                    ) : (
                      <BiCheckbox className="w-full h-full" />
                    )
                  ) : null}
                </div>
                <AiFillFileText className="file-image w-20 h-20 text-blue-500" />
                {currentUser === currentPatient.owner && (
                  <TiDelete
                    className="absolute right-2 top-2 h-8 w-8 cursor-pointer text-red-500"
                    onClick={() => handleRemoveFile(file.name)}
                  />
                )}
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
