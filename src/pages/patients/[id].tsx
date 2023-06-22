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
    dispatch(sharePatient({ patientId: patient.id, address: sharedAddress }));
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
          },
        })
      );
    }
  };

  const handleAcceptRequest = (requestor: string) => {
    dispatch(acceptAccessRequest({ patientId: patient.id, requestor }));
    dispatch(
      addNotification({
        address: requestor,
        notification: {
          id: uuid(),
          read: false,
          message: `Your access request to patient ${patient.patient_id} has been accepted`,
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
        },
      })
    );
  };

  return (
    <div className="flex justify-between">
      <div className="w-full max-w-3xl mx-auto bg-gray-800 text-white shadow-md rounded-md overflow-hidden m-4 border-2 border-gray-600">
        <div className="px-4 py-2 flex md:flex-row flex-col">
          <div className="md:w-2/3 w-full">
            <h1 className="text-lg font-bold text-white">
              {patient.patient_id}
            </h1>
            <p className="text-sm text-white">Owner: {patient.owner}</p>
            <p className="text-sm text-white">Title: {patient.ownerTitle}</p>
            <p className="text-sm text-white">
              Created Date: {patient.createdDate}
            </p>
          </div>
          <div className="md:w-1/3 w-full px-4">
            {user.currentUserAddress === patient.owner && !isEditing && (
              <PatientOwnerActions
                isEditing={isEditing}
                newOwner={newOwner}
                setNewOwner={setNewOwner}
                handleTransfer={handleTransfer}
                sharedAddress={sharedAddress}
                setSharedAddress={setSharedAddress}
                handleShare={handleShare}
                sharedWith={patient.sharedWith}
                handleUnshare={handleUnshare}
              />
            )}
            <h3 className="text-lg font-bold text-white mt-4">Request List:</h3>
            <PatientRequestAccess
              patientId={id as string}
              handleRequestAccess={handleRequestAccess}
              requestPending={patient.accessRequests.includes(
                currentUserAddress
              )}
              accessRequests={patient.accessRequests}
              handleAcceptRequest={handleAcceptRequest}
              handleRejectRequest={handleRejectRequest}
              currentUserAddress={currentUserAddress}
              patientOwner={patient.owner}
            />
          </div>
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
      <div className="w-full max-w-2xl mx-auto bg-gray-800 text-white shadow-md rounded-md overflow-hidden m-4 border-2 border-gray-600">
        {(patient.sharedWith.includes(user.currentUserAddress) ||
          user.currentUserAddress === patient.owner) && (
          <PatientFileSection patientId={id as string} />
        )}
      </div>
    </div>
  );
};

export default PatientPage;
