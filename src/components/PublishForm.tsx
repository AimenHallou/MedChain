// src/components/PublishForm.tsx
import React, { FC, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from '../redux/store';
import { useRouter } from "next/router";
import { resetForm } from "../redux/slices/formSlice";
import { createPatient } from "../redux/slices/patientSlice";
import { addNotification } from "../redux/slices/userSlice";
import { RootState } from "../redux/store";
import { uuid } from "uuidv4";
import ContentSection from "./publish/ContentSection";
import ShareSection from "./publish/ShareSection";
import Patient_idSection from "./publish/Patient_idSection";
import FileCardsSection from "./publish/FileCardsSection";
import { create } from 'ipfs-http-client';

const ipfs = create({ host: 'localhost', port: 5001, protocol: 'http' });

const addFileToIPFS = async (buffer) => {
    const result = await ipfs.add(buffer);
    return result.path;
};

const PublishForm: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const form = useSelector((state: RootState) => state.form);
  const [sharedUsers, setSharedUsers] = useState<string[]>([]);
  const { users, currentUserAddress } = useSelector(
    (state: RootState) => state.user
  );
  const currentUser = users.find((user) => user.address === currentUserAddress);

  const sharedData: { [address: string]: string[]; } = {};

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const createdDate = new Date().toISOString();
    
    const sharedWith: { [address: string]: string[]; } = {};
    sharedUsers.forEach((sharedUser) => {
      sharedWith[sharedUser] = [];
    });
    const ownerAddress = currentUser?.address || "";

    let updatedContent = form.content ? [...form.content] : [];
  
    if (form.content && form.content.length > 0) {
      for (let i = 0; i < form.content.length; i++) {
        const file = form.content[i];
        const buffer = Buffer.from(file.base64, "base64");
        const result = await ipfs.add(buffer);
        updatedContent[i] = {
          base64: "",
          name: file.name,
          dataType: file.dataType,
          ipfsCID: result.path
        };
      }
    }

    dispatch(
      createPatient({
        ...form,
        content: updatedContent,
        patient_id: form.patient_id,
        owner: ownerAddress,
        createdDate,
        sharedWith,
        history: [`Patient created by ${ownerAddress} on ${createdDate}`],
      })
    );

    sharedUsers.forEach((sharedUser) => {
      dispatch(
        addNotification({
          address: sharedUser,
          notification: {
            id: uuid(),
            read: false,
            message: `You have been added as a shared user to the patient with id "${form.patient_id}".`,
            patient_id: form.patient_id
          },
        })
      );
    });    
  
    dispatch(resetForm());
    router.push("/");
  };

  
  return (
    <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-4 bg-gray-900 p-4 lg:p-8 text-white ">
      <form onSubmit={handleSubmit} className="w-full lg:w-[30rem] bg-gray-700 p-6 rounded mt-10 text-white border-2 border-gray-600">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Create Patient Data
        </h1>
        <Patient_idSection />
        <ContentSection />
        <ShareSection sharedUsers={sharedUsers} setSharedUsers={setSharedUsers} />
  
        <div className="flex items-center justify-center mt-5">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Publish
          </button>
        </div>
      </form>
        <FileCardsSection />
    </div>
  );  
};

export default PublishForm;
