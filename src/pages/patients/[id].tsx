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
} from "../../redux/slices/patientSlice";
import { v4 as uuid } from "uuid";

import PatientOwnerActions from "./PatientOwnerActions";
import PatientHistory from "./PatientHistory";
import PatientRequestAccess from "./PatientRequestAccess";
import PatientFileSection from "./PatientFileSection";
import PatientHeader from "./PatientHeader";
import { addNotification } from "../../redux/slices/userSlice";

const PatientPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const patients = useSelector((state: RootState) => state.patients);
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [patientData, setPatientData] = useState<any | null>(null);

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
          setPatientData(patientCopy);
        })
        .catch((error) => console.error("Failed to fetch patient:", error));
    }
  }, [id, dispatch]);

  if (!patientData) {
    return <div>Loading...</div>;
  }

  const patient = patientData;
  const handleTransfer = () => {
    if (newOwner) {
      dispatch(transferOwnership({ patientId: patient.patient_id, newOwner }));
      setNewOwner("");
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
    dispatch(unsharePatient({ patientId: patient.patient_id, address }))
      .then(() => {
        return dispatch(fetchSinglePatient(id as string)).unwrap();
      })
      .then((updatedPatient) => {
        setPatientData(updatedPatient);
      });
  };

  const handleRequestAccess = () => {
    if (currentUserAddress) {
      const requestPending = patient.accessRequests
        ? patient.accessRequests.includes(currentUserAddress)
        : false;
      if (!requestPending) {
        dispatch(
          requestAccess({
            patient_id: patient.patient_id,
            requestor: currentUserAddress,
          })
        )
          .then(() => {
            return dispatch(fetchSinglePatient(id as string)).unwrap();
          })
          .then((updatedPatient) => {
            setPatientData(updatedPatient);
          });
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
    }
  };

  const handleCancelRequest = () => {
    if (currentUserAddress) {
      const requestPending = patient.accessRequests
        ? patient.accessRequests.includes(currentUserAddress)
        : false;
      if (requestPending && currentUserAddress) {
        dispatch(
          cancelRequest({
            patient_id: patient.patient_id,
            requestor: currentUserAddress,
          })
        )
          .then(() => {
            return dispatch(fetchSinglePatient(id as string)).unwrap();
          })
          .then((updatedPatient) => {
            setPatientData(updatedPatient);
          });
      }
    }
  };

  const handleAcceptRequest = (requestor: string, files: string[]) => {
    dispatch(
      acceptAccessRequest({ patientId: patient.patient_id, requestor, files })
    )
      .then(() => {
        return dispatch(fetchSinglePatient(id as string)).unwrap();
      })
      .then((updatedPatient) => {
        setPatientData(updatedPatient);
      });
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
    dispatch(rejectAccessRequest({ patientId: patient.patient_id, requestor }))
      .then(() => {
        return dispatch(fetchSinglePatient(id as string)).unwrap();
      })
      .then((updatedPatient) => {
        setPatientData(updatedPatient);
      });
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
    if (selectedUsers) {
      dispatch(
        updateSharedFiles({
          patientId: patient.patient_id,
          address: selectedUsers,
          files,
        })
      )
        .then(() => {
          return dispatch(fetchSinglePatient(id as string)).unwrap();
        })
        .then((updatedPatient) => {
          setPatientData(updatedPatient);
        });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-4 mt-10 mx-4">
      <div className="w-full lg:w-[20rem] bg-gray-700 text-white shadow-md rounded-md overflow-hidden m-4 border-2 border-gray-600">
        <PatientHeader
          Patient_id={patient.patient_id}
          owner={patient.owner}
          ownerTitle={patient.ownerTitle}
          createdDate={patient.createdDate}
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
              patient={patient}
            />
          )}
          <PatientRequestAccess
            patientId={id as string}
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
            patientOwner={patient.owner}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            selectedRequestor={selectedRequestor}
            setSelectedRequestor={setSelectedRequestor}
          />
        </div>
        <PatientHistory history={patient.history} />
      </div>
      {(Object.keys(patient.sharedWith || {}).includes(
        user.currentUserAddress || ""
      ) ||
        user.currentUserAddress === patient.owner) && (
        <div className="w-full lg:w-[40rem] bg-gray-700 text-white rounded-md overflow-hidden m-4 border-2 border-gray-600">
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
