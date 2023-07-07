// src/components/publish/ContentSection.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBase64Content } from '../../redux/slices/formSlice';
import { setFormContent } from '../../redux/slices/formSlice';
import { FileData } from "../../objects/types";

const ContentSection: React.FC = () => {
  const dispatch = useDispatch();
  const [filesData, setFilesData] = useState<FileData[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      let fileContents: FileData[] = [];

      files.forEach((file, index) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            if (typeof reader.result === "string") {
              const base64String = reader.result.split(",")[1];
              fileContents.push({ base64: base64String, name: file.name });
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
      </div>
    </div>
  );
};

export default ContentSection;
