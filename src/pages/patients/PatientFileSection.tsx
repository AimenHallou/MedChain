// src/components/PatientFileSection.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { AiFillFileText } from "react-icons/ai";
import { removeFile, addFile } from "../../redux/slices/patientSlice";
import { setFormContent } from "../../redux/slices/formSlice";
import { TiDelete } from "react-icons/ti";
import { BiSolidEditAlt } from "react-icons/bi";
import { AiFillFileAdd } from "react-icons/ai";
import { FileData } from "../../objects/types";
import { create } from "ipfs-http-client";

const ipfs = create({ host: "localhost", port: 5001, protocol: "http" });

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
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector(
    (state: RootState) => state.user.currentUserAddress
  );

  const patient = useSelector((state: RootState) => state.patients);
  const currentPatient = patient.find(
    (patient) => patient.patient_id === patientId
  );
  const [filesData, setFilesData] = useState<FileData[]>([]);
  const dataTypes = [
    "Lab results",
    "Medical images",
    "Medication history",
    "Clinician notes",
  ];

  const fetchFileFromIPFS = async (cid: string): Promise<string> => {
    try {
      const chunks: Uint8Array[] = [];
      for await (const chunk of ipfs.cat(cid)) {
        chunks.push(chunk);
      }

      const blob = new Blob(chunks, { type: 'application/octet-stream' });

      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            const base64 = reader.result.split(",")[1];
            resolve(base64);
          } else {
            reject(new Error("Failed to convert Blob to base64"));
          }
        };
        reader.readAsDataURL(blob);
      });

    } catch (error) {
      console.error(`Failed to fetch file from IPFS with CID ${cid}:`, error);
      return "";
    }
  };

  const handleFileClick = async (file: FileData) => {
    if (file.ipfsCID) {
      const base64Content = await fetchFileFromIPFS(file.ipfsCID);
      if (base64Content) {
        console.log(base64Content);
      }
    }
  };

  const handleRemoveFile = (fileName: string) => {
    if (currentUser === currentPatient?.owner) {
      dispatch(removeFile({ patientId, fileName }));
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAddFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      let fileContents: FileData[] = [];
  
      for (const file of files) {
        const reader = new FileReader();
  
        const result: Promise<FileData> = new Promise((resolve, reject) => {
          reader.onloadend = async () => {
            if (typeof reader.result === "string") {
              const base64String = reader.result.split(",")[1];
  
              const buffer = Buffer.from(base64String, "base64");
              try {
                const ipfsResult = await ipfs.add(buffer);
                resolve({
                  base64: "",
                  name: file.name,
                  dataType: "",
                  ipfsCID: ipfsResult.path,
                });
              } catch (ipfsError) {
                console.error("Error uploading to IPFS:", ipfsError);
                reject(ipfsError);
              }
            } else {
              reject(new Error("Unexpected result type from FileReader"));
            }
          };
        });
  
        reader.readAsDataURL(file);
  
        const fileData = await result;
        fileContents.push(fileData);
  
        dispatch(
          addFile({
            patientId: patientId,
            file: fileData,
            owner: currentUser || "",
          })
        );
      }
  
      const newFilesData = [...filesData, ...fileContents];
      setFilesData(newFilesData);
      dispatch(setFormContent(newFilesData));
    }
  };  

  const [editing, setEditing] = useState(false);

  if (!currentPatient) return null;

  const isOwner = currentUser === currentPatient.owner;

  let accessibleFiles: string[] = [];

  let content = currentPatient.content;

  if (typeof content === "string") {
    try {
      content = JSON.parse(content);
    } catch (error) {
      console.error("Failed to parse currentPatient.content:", error);
    }
  }

  let sharedWith = currentPatient.sharedWith;

  if (typeof sharedWith === "string") {
    try {
      sharedWith = JSON.parse(sharedWith);
    } catch (error) {
      console.error("Failed to parse currentPatient.sharedWith:", error);
      sharedWith = {};
    }
  }

  if (isOwner) {
    if (Array.isArray(content)) {
      accessibleFiles = content.map((file) => file.name);
    }
  } else if (currentUser) {
    accessibleFiles = sharedWith[currentUser] || [];
  }

  let contentArray: any[] = [];

  if (typeof currentPatient.content === "string") {
    try {
      const parsedContent = JSON.parse(currentPatient.content);
      if (Array.isArray(parsedContent)) {
        contentArray = parsedContent;
        console.log(contentArray);
      }
    } catch (error) {
      console.error("Failed to parse currentPatient.content:", error);
    }
  } else if (Array.isArray(currentPatient.content)) {
    contentArray = currentPatient.content;
  }

  return (
    <div className="bg-gray-700 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6 flex-col sm:flex-row">
        <div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Attached Files
          </h2>
          {(selectedRequestor || selectedUsers) && (
            <p className="text-gray-300 italic">Select Files to share</p>
          )}
        </div>
        {isOwner && (
          <div className="flex">
            <button
              className="flex items-center gap-2 text-blue-500  px-4 py-2 rounded hover:bg-blue-900 transition duration-200"
              onClick={() => setEditing(!editing)}
            >
              <BiSolidEditAlt className="h-8 w-8" />
            </button>
            <button
              className="flex items-center gap-2 text-blue-500  px-4 py-2 rounded hover:bg-blue-900 transition duration-200"
              onClick={() => fileInputRef.current?.click()}
            >
              <AiFillFileAdd className="h-8 w-8" />
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={handleAddFile}
              />
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentArray
          .filter((file) => accessibleFiles.includes(file.name))
          .map((file, index) => (
            <div
              key={index}
              className={`file-card relative flex flex-col items-center justify-center p-6 rounded-lg cursor-pointer border-2 border-transparent`}
              onClick={() => handleFileClick(file)}
            >
              <AiFillFileText
                className={`file-image w-16 h-16 mb-2 ${
                  selectedFiles.includes(file.name) &&
                  (selectedRequestor || selectedUsers)
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              />
              <div className="text-gray-100 font-bold text-center truncate w-full">
                {file.name}
              </div>
              <div className="text-gray-300 mt-2">{file.dataType}</div>
              {isOwner && editing && (
                <div>
                  <select
                    value={file.dataType}
                    onChange={(e) => {}}
                    className="bg-gray-800 text-white rounded mt-2"
                  >
                    <option value="">Select data type</option>
                    {dataTypes.map((dataType) => (
                      <option key={dataType} value={dataType}>
                        {dataType}
                      </option>
                    ))}
                  </select>
                  <button
                    className="absolute right-2 top-2 p-2 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(file.name);
                    }}
                  >
                    <TiDelete className="h-8 w-8 text-red-700" />
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default PatientFileSection;
