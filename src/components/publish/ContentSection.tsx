// src/components/publish/ContentSection.tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setBase64Content, setFormContent } from "../../redux/slices/formSlice";
import { FileData } from "../../objects/types";

const ContentSection: React.FC = () => {
  const dispatch = useDispatch();
  const [filesData, setFilesData] = useState<FileData[]>([]);

  const dataTypes = [
    "Lab results",
    "Medical images",
    "Medication history",
    "Clinician notes",
  ];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      let fileContents: FileData[] = [];

      files.forEach((file, index) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            const base64String = reader.result.split(",")[1];
            fileContents.push({
              base64: base64String,
              name: file.name,
              dataType: "",
            });
            if (fileContents.length === files.length) {
              const newFilesData = [...filesData, ...fileContents];
              setFilesData(newFilesData);
              dispatch(setFormContent(newFilesData));
            }
          } else {
            console.error("Unexpected result type from FileReader");
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDataTypeChange = (index: number, dataType: string) => {
    const updatedFilesData = filesData.map((file, idx) => {
      if (idx === index) {
        return { ...file, dataType: dataType };
      }
      return file;
    });
    setFilesData(updatedFilesData);
    dispatch(setFormContent(updatedFilesData));
  };

  return (
    <div className="mb-4">
      <div className="">
        <label className="block text-white font-bold mb-2" htmlFor="content">
          Content
        </label>
        <input
          id="content"
          name="content"
          type="file"
          onChange={handleFileChange}
          className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 rounded outline-none focus:bg-gray-900"
          multiple
        />
        <div className="mt-4">
          {filesData.length > 0 && (
            <label className="block text-white font-bold mb-2">
              Data Types
            </label>
          )}
          {filesData.map((fileData, index) => (
            <div key={index} className="flex items-center justify-between mb-2">
              <span className="text-white">{fileData.name}</span>
              <select
                value={fileData.dataType}
                onChange={(e) => handleDataTypeChange(index, e.target.value)}
                className="ml-4 bg-gray-800 text-white rounded"
              >
                <option value="">Select data type</option>
                {dataTypes.map((dataType) => (
                  <option key={dataType} value={dataType}>
                    {dataType}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentSection;
