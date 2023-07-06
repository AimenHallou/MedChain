// src/pages/patients/[id].tsx
import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/store";
import {
  updatePatient,
  transferOwnership,
  sharePatient,
  unsharePatient,
  acceptAccessRequest,
  rejectAccessRequest,
  requestAccess,
  cancelRequest,
  updateSharedFiles,
} from "../../redux/slices/patientSlice";
import { v4 as uuid } from "uuid";

import PatientEditForm from "./PatientEditForm";
import PatientOwnerActions from "./PatientOwnerActions";
import PatientHistory from "./PatientHistory";
import PatientRequestAccess from "./PatientRequestAccess";
import PatientFileSection from "./PatientFileSection";
import { addNotification } from "../../redux/slices/userSlice";

const PatientPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const patients = useSelector((state: RootState) => state.patients);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const patient = patients.find((patient) => patient.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient_id, setEditedPatient_id] = useState("");
  const [editedContent, setEditedContent] = useState<File[]>([]);
  const [newOwner, setNewOwner] = useState("");
  const [sharedAddress, setSharedAddress] = useState("");
  const currentUserAddress = useSelector(
    (state: RootState) => state.user.currentUserAddress
  );
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedRequestor, setSelectedRequestor] = useState<string | null>(
    null
  );
  const [selectedUsers, setSelectedUsers] = useState<string | null>(null);

  useEffect(() => {
    if (patient) {
      setEditedPatient_id(patient.patient_id);
      if (Array.isArray(patient.content)) {
        const files = patient.content.map((fileData) => {
          const base64String = fixBase64Padding(fileData.base64);
          const decodedData = atob(base64String);
          const array = new Uint8Array(decodedData.length);
          for (let i = 0; i < decodedData.length; i++) {
            array[i] = decodedData.charCodeAt(i);
          }
          const blob = new Blob([array.buffer]);
          const file = new File([blob], fileData.name);
          return file;
        });
        setEditedContent(files);
      }
    }
  }, [patient]);

  if (!patient) {
    return <div>Patient not found</div>;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const fileDataArray = await Promise.all(
      editedContent.map(async (file) => {
        const base64 = await toBase64(file);
        return {
          base64: base64.split(",")[1],
          name: file.name,
        };
      })
    );

    dispatch(
      updatePatient({
        id: patient.id,
        patient_id: editedPatient_id,
        content: fileDataArray,
      })
    );

    setIsEditing(false);
  };

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const fixBase64Padding = (base64String: string): string => {
    let paddedBase64 = base64String;
    while (paddedBase64.length % 4 !== 0) {
      paddedBase64 += "=";
    }
    return paddedBase64;
  };

  const handleTransfer = () => {
    dispatch(transferOwnership({ patientId: patient.id, newOwner }));
    setNewOwner("");
  };

  const handleShare = () => {
    dispatch(
      sharePatient({
        patientId: patient.id,
        address: sharedAddress,
        files: patient.content.map((fileData) => fileData.name),
      })
    );
    setSharedAddress("");
  };

  const handleUnshare = (address: string) => {
    dispatch(unsharePatient({ patientId: patient.id, address }));
  };

  const handleRequestAccess = () => {
    const requestPending = patient.accessRequests.includes(currentUserAddress);
    if (!requestPending) {
      dispatch(
        requestAccess({ patientId: patient.id, requestor: currentUserAddress })
      );
      dispatch(
        addNotification({
          address: patient.owner,
          notification: {
            id: uuid(),
            read: false,
            message: `${currentUserAddress} has requested access to patient ${patient.patient_id}`,
            patient_id: patient.patient_id,
          },
        })
      );
    }
  };

  const handleCancelRequest = () => {
    const requestPending = patient.accessRequests.includes(currentUserAddress);
    if (requestPending) {
      dispatch(
        cancelRequest({ patientId: patient.id, requestor: currentUserAddress })
      );
    }
  };

  const handleAcceptRequest = (requestor: string, files: string[]) => {
    dispatch(acceptAccessRequest({ patientId: patient.id, requestor, files }));
    dispatch(
      addNotification({
        address: requestor,
        notification: {
          id: uuid(),
          read: false,
          message: `Your access request to patient ${patient.patient_id} has been accepted`,
          patient_id: patient.patient_id,
        },
      })
    );
  };

  const handleRejectRequest = (requestor: string) => {
    dispatch(rejectAccessRequest({ patientId: patient.id, requestor }));
    dispatch(
      addNotification({
        address: requestor,
        notification: {
          id: uuid(),
          read: false,
          message: `Your access request to patient ${patient.patient_id} has been rejected`,
          patient_id: patient.patient_id,
        },
      })
    );
  };

  const handleUpdateSharedFiles = (address: string, files: string[]) => {
    dispatch(updateSharedFiles({ patientId: patient.id, address, files }));
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-4 mt-10 mx-4">
      <div className="w-full lg:w-[25rem] bg-gray-700 text-white shadow-md rounded-md overflow-hidden m-4 border-2 border-gray-600">
        <div className="px-6 py-4">
          <h2 className="text-center text-3xl font-bold text-white mb-6">
            {patient.patient_id}
          </h2>
          <div className="space-y-4 text-center">
            <p className="text-lg text-gray-300">
              <span className="font-semibold">
                {patient.ownerTitle} {patient.owner}
              </span>
            </p>
            <p className="text-lg text-gray-300">
              <span className="font-semibold">{patient.createdDate}</span>
            </p>
          </div>
        </div>
        <div className="px-6 py-2 space-y-4 border-t border-gray-700">
          {user.currentUserAddress === patient.owner && !isEditing && (
            <PatientOwnerActions
              isEditing={isEditing}
              newOwner={newOwner}
              setNewOwner={setNewOwner}
              handleTransfer={handleTransfer}
              sharedAddress={sharedAddress}
              setSharedAddress={setSharedAddress}
              handleShare={handleShare}
              sharedWith={Object.keys(patient.sharedWith)}
              handleUnshare={handleUnshare}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              selectedUser={selectedUsers}
              setSelectedUser={setSelectedUsers}
              handleUpdateSharedFiles={() =>
                handleUpdateSharedFiles(selectedUsers, selectedFiles)
              }
            />
          )}
          <PatientRequestAccess
            patientId={id as string}
            handleRequestAccess={handleRequestAccess}
            requestPending={patient.accessRequests.includes(currentUserAddress)}
            accessRequests={patient.accessRequests}
            handleCancelRequest={handleCancelRequest}
            handleAcceptRequest={handleAcceptRequest}
            handleRejectRequest={handleRejectRequest}
            accessList={Object.keys(patient.sharedWith)}
            currentUserAddress={currentUserAddress}
            patientOwner={patient.owner}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            selectedRequestor={selectedRequestor}
            setSelectedRequestor={setSelectedRequestor}
          />
        </div>
        <PatientHistory history={patient.history} />
        {isEditing && (
          <PatientEditForm
            editedPatient_id={editedPatient_id}
            setEditedPatient_id={setEditedPatient_id}
            editedContent={editedContent}
            setEditedContent={setEditedContent}
            handleSave={handleSave}
          />
        )}
      </div>
      {(Object.keys(patient.sharedWith).includes(user.currentUserAddress) ||
        user.currentUserAddress === patient.owner) && (
        <div className="w-full lg:w-[30rem] bg-gray-700 text-white rounded-md overflow-hidden m-4 border-2 border-gray-600">
          <PatientFileSection
            patientId={id as string}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            selectedRequestor={selectedRequestor}
            selectedUsers={selectedUsers}
          />
        </div>
      )}
    </div>
  );
};

export default PatientPage;
