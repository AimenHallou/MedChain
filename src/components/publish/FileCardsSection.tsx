// src/components/publish/FileCardsSection.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setFormContent } from '../../redux/slices/formSlice';
import {AiFillFileText} from 'react-icons/ai';


const FileCardsSection: React.FC = () => {
  const dispatch = useDispatch();
  const filesData = useSelector((state: RootState) => state.form.content);

  const handleFileNameChange = (index: number, name: string) => {
    const newFilesData = [...filesData];
    newFilesData[index] = {...newFilesData[index], name: name};
    dispatch(setFormContent(newFilesData));
  };

  const renderFileCards = () => {
    return filesData.map((file, index) => (
      <div key={index} className="file-card mt-2 flex flex-col items-center rounded p-4">
        <AiFillFileText className="file-image w-20 h-20"/>
        <label className="block text-white font-bold mb-2 mt-4" htmlFor={`fileName-${index}`}>
          File {index + 1} name:
        </label>
        <input
          id={`fileName-${index}`}
          name={`fileName-${index}`}
          type="text"
          value={file.name}
          onChange={(e) => handleFileNameChange(index, e.target.value)}
          className="file-name-input w-3/4 px-3 py-2 text-white bg-gray-800 rounded outline-none focus:bg-gray-600"
        />
      </div>
    ));
  };

  return (
    <div className="file-cards-section">
      <h2 className="text-center text-2xl font-bold text-white mb-4">
        Uploaded Files
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filesData && renderFileCards()}
      </div>
    </div>
  );
};

export default FileCardsSection;
