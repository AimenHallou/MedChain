// src/components/publish/ContentSection.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBase64Content } from '../../redux/slices/formSlice';
import { setFormContent } from '../../redux/slices/formSlice';

interface FileData {
  base64: string;
  name: string;
}

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
                setFilesData(fileContents);
                dispatch(setFormContent(fileContents));
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
    <div className="flex justify-center mb-4">
      <div className="w-1/2">
        <label className="block text-white font-bold mb-2" htmlFor="content">
          Content
        </label>
        <input
          id="content"
          name="content"
          type="file"
          onChange={handleFileChange}
          className="w-full px-3 py-2 text-white placeholder-white bg-gray-700 rounded outline-none focus:bg-gray-600"
          multiple
        />
      </div>
    </div>
  );
};

export default ContentSection;
