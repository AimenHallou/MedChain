// src/components/DatasetPublishForm.tsx
import React, { FC, FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { create } from 'ipfs-http-client';

const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });

const DatasetPublishForm: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<File | null>(null);
  
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    console.log("Publishing dataset...");

    if(content) {
      const buffer = await content.arrayBuffer();
      const result = await ipfs.add(new Uint8Array(buffer));
      console.log("IPFS CID:", result.path);
    }

    console.log("Description:", description);
    
    // Dispatch actions to add dataset to the Redux store
    // Navigate to a different page if needed
  };
  
  return (
    <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-4 bg-gray-900 p-4 lg:p-8 text-white ">
      <form onSubmit={handleSubmit} className="w-full lg:w-[30rem] bg-gray-700 p-6 rounded mt-10 text-white border-2 border-gray-600">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Create Dataset
        </h1>

        <div className="mb-4">
          <label className="block text-white font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea 
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 rounded outline-none focus:bg-gray-900"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white font-bold mb-2" htmlFor="content">
            Upload Dataset
          </label>
          <input 
            type="file"
            id="content"
            onChange={(e) => setContent(e.target.files ? e.target.files[0] : null)}
            className="w-full px-3 py-2 text-white placeholder-gray-400 bg-gray-800 rounded outline-none focus:bg-gray-900"
          />
        </div>

        <div className="flex items-center justify-center mt-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );  
};

export default DatasetPublishForm;
