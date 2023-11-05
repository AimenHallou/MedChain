// src/page/components/FileSystem.tsx

import React from 'react';
import { AiFillFileText } from 'react-icons/ai';
import { BiCheckbox, BiCheckboxSquare } from 'react-icons/bi';

interface File {
  name: string;
  dataType: string;
}

interface FileSystemProps {
  content: File[];
  checkedItems: boolean[];
  handleCheckboxToggle: (index: number) => void;
}



const FileSystem: React.FC<FileSystemProps> = ({ content, checkedItems, handleCheckboxToggle }) => {
  return (
    <div className="w-full lg:w-[40rem] bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden m-4 border border-gray-700">
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold mb-4">Dataset Content</h2>
        <div className="max-h-[300px] overflow-y-auto">
          {Array.isArray(content) && content.length > 0 ? (
            <>
              <div className="flex border-b border-dashed border-gray-750 py-2 text-gray-300 mb-4">
                <span className="flex-shrink-0 w-8 mr-5"></span>
                <span className="flex-grow text-left font-semibold">File Name</span>
                <span className="ml-2 text-left font-semibold">File Type</span>
                <span className="w-8 ml-10 text-center font-semibold">Select</span>
              </div>
              <ul>
                {content.map((file, index) => (
                  <li key={index} className="flex items-center border-b border-dashed border-gray-750 py-3 space-x-3 hover:bg-gray-750 transition-colors duration-200">
                    <AiFillFileText className="text-2xl text-blue-500 flex-shrink-0 w-8 mr-3" />
                    <p className="flex-grow truncate font-medium text-lg">{file.name}</p>
                    <span className="text-sm text-blue-400 ml-2 mr-5">{file.dataType}</span>
                    <div className="text-blue-500 cursor-pointer w-8 h-8 flex items-center justify-center" onClick={() => handleCheckboxToggle(index)}>
                      {checkedItems[index] ? <BiCheckbox className="w-6 h-6" /> : <BiCheckboxSquare className="w-6 h-6" />}
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm italic mt-4">No files available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileSystem;
