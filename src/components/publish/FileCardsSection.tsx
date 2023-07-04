// src/components/publish/FileCardsSection.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setFormContent } from '../../redux/slices/formSlice';
import {AiFillFileText} from 'react-icons/ai';
import { TiDelete } from 'react-icons/ti';  // Import MdDelete from react-icons

const FileCardsSection: React.FC = () => {
  const dispatch = useDispatch();
  const filesData = useSelector((state: RootState) => state.form.content);

  const handleFileNameChange = (index: number, name: string) => {
    const newFilesData = [...filesData];
    newFilesData[index] = {...newFilesData[index], name: name};
    dispatch(setFormContent(newFilesData));
  };

  // Function to remove file
  const handleFileRemove = (index: number) => {
    const newFilesData = filesData.filter((_, i) => i !== index);
    dispatch(setFormContent(newFilesData));
  };

  return (
    filesData && filesData.length > 0 && (
      <div className="w-full lg:w-[35rem] bg-gray-700 p-6 rounded mt-10 text-white">
        <div className="file-cards-section">
          <h2 className="text-center text-2xl font-bold text-white mb-1.5">
            Uploaded Files
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filesData.map((file, index) => (
              <div key={index} className="file-card mt-2 flex flex-col items-center rounded p-3 bg-gray-700 relative">  {/* Add relative to position delete icon correctly */}
                <TiDelete className="absolute right-2 top-2 h-8 w-8 cursor-pointer text-red-500" onClick={() => handleFileRemove(index)}/>  {/* Add delete icon */}
                <AiFillFileText className="file-image w-20 h-20 text-blue-500 mb-2"/>
                <input
                  id={`fileName-${index}`}
                  name={`fileName-${index}`}
                  type="text"
                  value={file.name}
                  onChange={(e) => handleFileNameChange(index, e.target.value)}
                  className="file-name-input w-full h-10 px-3 py-4 text-white placeholder-gray-400 bg-gray-800 rounded outline-none focus:bg-gray-900"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default FileCardsSection;
