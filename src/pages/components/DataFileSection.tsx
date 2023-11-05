// src/components/DataFileSection.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { AiFillFileText, AiFillFileAdd } from "react-icons/ai";

import { TiDelete } from "react-icons/ti";
import { BiSolidEditAlt } from "react-icons/bi";
import { FileData } from "../../objects/types";

type DataFileSectionProps = {
  dataId: string;
  content: FileData[];
  owner: string;
  sharedWith: Record<string, string[]>;
  selectedFiles: string[];
  setSelectedFiles: (files: string[]) => void;
  selectedRequestor: string | null;
  selectedUsers: string | null;
  handleAddFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (fileName: string) => void;
  handleFileClick: (file: FileData) => void;
};

const DataFileSection: React.FC<DataFileSectionProps> = ({
  dataId,
  content,
  owner,
  sharedWith,
  selectedFiles,
  setSelectedFiles,
  selectedRequestor,
  selectedUsers,
  handleAddFile,
  handleRemoveFile,
  handleFileClick
}) => {
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector(
    (state: RootState) => state.user.currentUserAddress
  );

  const [filesData, setFilesData] = useState<FileData[]>([]);
  const dataTypes = [
    "Lab results",
    "Medical images",
    "Medication history",
    "Clinician notes",
  ];

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);

  if (!dataId) return null;

  const isOwner = currentUser === owner;

  let accessibleFiles: string[] = [];

  if (typeof content === "string") {
    try {
      content = JSON.parse(content);
    } catch (error) {
      console.error("Failed to parse currentPatient.content:", error);
    }
  }

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

  if (typeof content === "string") {
    try {
      const parsedContent = JSON.parse(content);
      if (Array.isArray(parsedContent)) {
        contentArray = parsedContent;
        console.log(contentArray);
      }
    } catch (error) {
      console.error("Failed to parse currentPatient.content:", error);
    }
  } else if (Array.isArray(content)) {
    contentArray = content;
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
              className={`file-card relative flex flex-col items-center justify-between p-4 rounded-lg cursor-pointer border-2 border-transparent`}
              onClick={() => {
                handleFileClick(file);

                if (
                  ((currentUser === owner && selectedUsers) ||
                    selectedRequestor) &&
                  selectedFiles.includes(file.name)
                ) {
                  setSelectedFiles(
                    selectedFiles.filter(
                      (selectedFile) => selectedFile !== file.name
                    )
                  );
                } else if (
                  ((currentUser === owner && selectedUsers) ||
                    selectedRequestor) &&
                  !selectedFiles.includes(file.name)
                ) {
                  setSelectedFiles([...selectedFiles, file.name]);
                }
              }}
            >
              <div className="relative">
                <AiFillFileText
                  className={`file-image w-16 h-16 mb-2 ${
                    selectedFiles.includes(file.name) &&
                    (selectedRequestor || selectedUsers)
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                />
                {isOwner && editing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(file.name);
                    }}
                    className="absolute bottom-14 left-12 z-10"
                  >
                    <TiDelete className="h-8 w-8 text-red-700" />
                  </button>
                )}
              </div>
              <div className="text-gray-100 font-bold text-center truncate w-full">
                {file.name}
              </div>
              {file.dataType ? (
                <div className="text-gray-400 text-sm mb-2">
                  {file.dataType}
                </div>
              ) : (
                <div className="text-red-600 text-sm mb-2">
                  File type missing
                </div>
              )}
              {isOwner && editing && (
                <div className="flex flex-col space-y-2 absolute bottom-0.5 right-2">
                  <select
                    value={file.dataType}
                    onChange={(e) => {}}
                    className="bg-gray-800 text-white rounded mt-2 z-10"
                  >
                    <option value="">Select data type</option>
                    {dataTypes.map((dataType) => (
                      <option key={dataType} value={dataType}>
                        {dataType}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default DataFileSection;
