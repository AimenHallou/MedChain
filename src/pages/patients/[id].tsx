// src/pages/patients/[id].tsx
import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import {
  transferOwnership,
  sharePatient,
  unsharePatient,
  acceptAccessRequest,
  rejectAccessRequest,
  requestAccess,
  cancelRequest,
  updateSharedFiles,
  fetchSinglePatient,
  removeFile,
  addFile,
} from "../../redux/slices/patientSlice";
import { v4 as uuid } from "uuid";
import { FileData } from "../../objects/types";

import PatientOwnerActions from "../components/EntityOwnerActions";
import GenericHistory from "../components/GenericHistory";
import RequestAccess from "../components/RequestAccess";
import DataFileSection from "../components/DataFileSection";
import EntityHeader from "../components/EntityHeader";
import { addNotification } from "../../redux/slices/userSlice";
import { setFormContent } from "../../redux/slices/formSlice";
import { fetchFileFromIPFS } from "../../utils/fetchAndDecryptFromIPFS";

const PatientPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const patient = useSelector((state: RootState) =>
    state.patients.find((p) => p.patient_id === id)
  );
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.user.users);

  const dispatch = useDispatch<AppDispatch>();

  const [newOwner, setNewOwner] = useState("");
  const [sharedAddress, setSharedAddress] = useState("");
  const [healthcareType, setHealthcareType] = useState<string>("");
  const [organizationName, setOrganizationName] = useState<string>("");
  const currentUserAddress = useSelector(
    (state: RootState) => state.user.currentUserAddress
  );
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedRequestor, setSelectedRequestor] = useState<string | null>(
    null
  );
  const [selectedUsers, setSelectedUsers] = useState<string | null>(null);
  useEffect(() => {
    if (id) {
      dispatch(fetchSinglePatient(id as string))
        .unwrap()
        .then((patient) => {
          const patientCopy = { ...patient };
          if (typeof patientCopy.accessRequests === "string") {
            patientCopy.accessRequests = JSON.parse(patientCopy.accessRequests);
          }
          if (typeof patientCopy.sharedWith === "string") {
            patientCopy.sharedWith = JSON.parse(patientCopy.sharedWith);
          }
          const ownerUser = users.find(
            (user) => user.address === patient.owner
          );
          if (ownerUser) {
            setHealthcareType(ownerUser.healthcareType);
            setOrganizationName(ownerUser.organizationName);
          }
          patient = patientCopy;
        })
        .catch((error) => console.error("Failed to fetch patient:", error));
    }
  }, [id, dispatch]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const handleTransfer = () => {
    if (newOwner) {
      dispatch(transferOwnership({ patientId: patient.patient_id, newOwner }));
      setNewOwner("");
      router.push("/");
    }
  };

  const handleShare = () => {
    if (sharedAddress) {
      console.log("Shared address is present:", sharedAddress);

      const payload = {
        patientId: patient.patient_id,
        address: sharedAddress,
        files: patient.content
          ? patient.content.map((fileData) => fileData.name)
          : [],
      };
      console.log("Payload being dispatched:", payload);

      dispatch(sharePatient(payload));

      setSharedAddress("");
    } else {
      console.log("Shared address is missing or empty.");
    }
  };

  const handleUnshare = (address: string) => {
    if (!patient) return;

    dispatch(unsharePatient({ patientId: patient.patient_id, address }))
      .then(() => {
        return dispatch(fetchSinglePatient(patient.patient_id)).unwrap();
      })
      .catch((error) => {
        console.error("Error in unsharing patient:", error);
      });
  };

  const handleRequestAccess = () => {
    if (currentUserAddress && patient) {
      const requestPending =
        patient.accessRequests?.includes(currentUserAddress) ?? false;
      if (!requestPending) {
        dispatch(
          requestAccess({
            patient_id: patient.patient_id,
            requestor: currentUserAddress,
          })
        )
          .then(() => dispatch(fetchSinglePatient(patient.patient_id)))
          .catch((error) => console.error("Failed to request access:", error));
      }
    }
  };

  const handleCancelRequest = () => {
    if (currentUserAddress && patient) {
      const requestPending =
        patient.accessRequests?.includes(currentUserAddress) ?? false;
      if (requestPending) {
        dispatch(
          cancelRequest({
            patient_id: patient.patient_id,
            requestor: currentUserAddress,
          })
        )
          .then(() => dispatch(fetchSinglePatient(patient.patient_id)))
          .catch((error) => console.error("Failed to cancel request:", error));
      }
    }
  };

  const getPatientById = (patientId: string) => {
    const patients = useSelector((state: RootState) => state.patients);
    return patients.find((patient) => patient.patient_id === patientId);
  };

  const handleAcceptRequest = (requestor: string, files: string[]) => {
    if (patient) {
      dispatch(
        acceptAccessRequest({ patientId: patient.patient_id, requestor, files })
      )
        .then(() => dispatch(fetchSinglePatient(patient.patient_id)))
        .catch((error) =>
          console.error("Error in accepting access request:", error)
        );
    }
  };

  const handleRejectRequest = (requestor: string) => {
    if (patient) {
      dispatch(
        rejectAccessRequest({ patientId: patient.patient_id, requestor })
      )
        .then(() => dispatch(fetchSinglePatient(patient.patient_id)))
        .catch((error) =>
          console.error("Error in rejecting access request:", error)
        );
    }
  };

  const handleUpdateSharedFiles = (address: string, files: string[]) => {
    if (patient && selectedUsers) {
      dispatch(
        updateSharedFiles({
          patientId: patient.patient_id,
          address: selectedUsers,
          files,
        })
      )
        .then(() => dispatch(fetchSinglePatient(patient.patient_id)))
        .catch((error) =>
          console.error("Error in updating shared files:", error)
        );
    }
  };

  const handleFetchFile = async (cid: string): Promise<string> => {
    try {
      const decryptedFileBase64 = await fetchFileFromIPFS(cid);
      return decryptedFileBase64;
    } catch (error) {
      console.error("Error fetching and decrypting file:", error);
      return "";
    }
  };

  const handleFileClick = async (file: FileData) => {
    if (file.ipfsCID) {
      const base64Content = await handleFetchFile(file.ipfsCID);
      if (base64Content) {
        console.log(base64Content);
      }
    }
  };

  const handleAddFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (event.target.files) {
    //   const files = Array.from(event.target.files);
    //   let fileContents: FileData[] = [];

    //   for (const file of files) {
    //     const reader = new FileReader();

    //     // const result: Promise<FileData> = new Promise((resolve, reject) => {
    //     //   reader.onloadend = async () => {
    //     //     if (typeof reader.result === "string") {
    //     //       const base64String = reader.result.split(",")[1];

    //     //       const buffer = Buffer.from(base64String, "base64");
    //     //       try {
    //     //         const ipfsResult = await ipfs.add(buffer);
    //     //         resolve({
    //     //           base64: "",
    //     //           name: file.name,
    //     //           dataType: "",
    //     //           ipfsCID: ipfsResult.path,
    //     //         });
    //     //       } catch (ipfsError) {
    //     //         console.error("Error uploading to IPFS:", ipfsError);
    //     //         reject(ipfsError);
    //     //       }
    //     //     } else {
    //     //       reject(new Error("Unexpected result type from FileReader"));
    //     //     }
    //     //   };
    //     // });

    //     // reader.readAsDataURL(file);

    //     // const fileData = await result;
    //     // fileContents.push(fileData);

    //     // dispatch(
    //     //   addFile({
    //     //     patientId: patient.patient_id,
    //     //     file: fileData,
    //     //     owner: currentUserAddress || "",
    //     //   })
    //     // );
    //   }

    //   const newFilesData = [...patientData, ...fileContents];
    //   setPatientData(newFilesData);
    //   dispatch(setFormContent(newFilesData));
    // }
  };

  const handleRemoveFile = (fileName: string) => {
    if (currentUserAddress === patient?.owner) {
      dispatch(removeFile({ patientId: patient.patient_id, fileName }));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-4 mt-10 mx-4">
      <div className="w-full lg:w-[20rem] bg-gray-700 text-white shadow-md rounded-md overflow-hidden m-4 border-2 border-gray-600">
        <EntityHeader
          entityId={patient.patient_id}
          owner={patient.owner}
          healthcareType={healthcareType}
          organizationName={organizationName}
          createdDate={patient.createdDate}
          entityType="Patient"
        />
        <div className="px-6 py-2 space-y-4 border-t border-gray-700">
          {user.currentUserAddress === patient.owner && (
            <PatientOwnerActions
              newOwner={newOwner}
              setNewOwner={setNewOwner}
              handleTransfer={handleTransfer}
              sharedAddress={sharedAddress}
              setSharedAddress={setSharedAddress}
              handleShare={handleShare}
              sharedWith={patient.sharedWith}
              handleUnshare={handleUnshare}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              selectedUser={selectedUsers}
              setSelectedUser={setSelectedUsers}
              handleUpdateSharedFiles={handleUpdateSharedFiles}
              entity={patient}
            />
          )}
          <RequestAccess
            itemId={id as string}
            handleRequestAccess={handleRequestAccess}
            requestPending={
              patient.accessRequests
                ? patient.accessRequests.includes(currentUserAddress || "")
                : false
            }
            accessRequests={patient.accessRequests || []}
            handleCancelRequest={handleCancelRequest}
            handleAcceptRequest={handleAcceptRequest}
            handleRejectRequest={handleRejectRequest}
            accessList={
              patient.sharedWith && typeof patient.sharedWith === "object"
                ? Object.keys(patient.sharedWith)
                : []
            }
            currentUserAddress={currentUserAddress || ""}
            ownerAddress={patient.owner}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            selectedRequestor={selectedRequestor}
            setSelectedRequestor={setSelectedRequestor}
          />
        </div>
        <GenericHistory title="Patient History" data={patient?.history || []} />
      </div>
      {(Object.keys(patient.sharedWith || {}).includes(
        user.currentUserAddress || ""
      ) ||
        user.currentUserAddress === patient.owner) && (
        <div className="w-full lg:w-[40rem] bg-gray-700 text-white rounded-md overflow-hidden m-4 border-2 border-gray-600">
          <DataFileSection
            dataId={id as string}
            content={patient.content || []}
            owner={patient.owner}
            sharedWith={patient.sharedWith}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            selectedRequestor={selectedRequestor}
            selectedUsers={selectedUsers}
            handleAddFile={handleAddFile}
            handleRemoveFile={handleRemoveFile}
            handleFileClick={handleFileClick}
          />
        </div>
      )}
    </div>
  );
};

export default PatientPage;
