// src/components/publish/ContentSection.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBase64Content } from '../../redux/slices/formSlice';
import { RootState } from '../../redux/store';

const ContentSection: React.FC = () => {
  const dispatch = useDispatch();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      let fileContents: string[] = [];
  
      files.forEach((file, index) => {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            fileContents.push(reader.result);
            if (fileContents.length === files.length) {
              dispatch(setBase64Content(fileContents));
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
  );
};

export default ContentSection;
