// src/pages/datasets/[id].tsx
import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAppDispatch } from "../../app/hook";
import { AiFillFileText } from "react-icons/ai";
import { BiCheckboxSquare, BiCheckbox } from "react-icons/bi";
import EntityHeader from "../components/EntityHeader";
import GenericHistory from "../components/GenericHistory";
import RequestAccess from "../components/RequestAccess";
import EntityOwnerActions from "../components/EntityOwnerActions";
import { setFormContent } from "../../redux/slices/formSlice";
import { FileData } from "../../objects/types";
import DataFileSection from "../components/DataFileSection";

import {
  transferDatasetOwnership,
  shareDataset,
  unshareDataset,
  acceptDatasetAccessRequest,
  rejectDatasetAccessRequest,
  requestDatasetAccess,
  cancelDatasetRequest,
  updateSharedFiles,
  fetchSingleDataset,
  removeFileFromDataset,
  addFileToDataset,
  fetchDatasets
} from "../../redux/slices/datasetSlice";

const DatasetPage: FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const datasets = useSelector((state: RootState) => state.datasets);
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.user.users);

  const currentUserAddress = useSelector(
    (state: RootState) => state.user.currentUserAddress
  );
  const [selectedUsers, setSelectedUsers] = useState<string | null>(null);
  const [sharedAddress, setSharedAddress] = useState("");
  const [healthcareType, setHealthcareType] = useState<string>('');
  const [organizationName, setOrganizationName] = useState<string>('');

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedRequestor, setSelectedRequestor] = useState<string | null>(
    null
  );
  const [datasetData, setDatasetData] = useState<any | null>(null);
  const dataset = datasetData;

  const [newOwner, setNewOwner] = useState("");

  const handleTransfer = () => {
    if (newOwner) {
      dispatch(
        transferDatasetOwnership({ datasetId: dataset.dataset_id, newOwner })
      );
      setNewOwner("");
    }
  };

  const handleCheckboxToggle = (index: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getDatasetById = (id: string) => {
    const dataset = useSelector((state: RootState) =>
      state.datasets.find((dataset) => dataset.dataset_id === id)
    );
    return dataset;
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchSingleDataset(id as string))
        .unwrap()
        .then((fetchedDataset) => {
          if (fetchedDataset) {
            const datasetCopy = { ...fetchedDataset };
            if (typeof datasetCopy.accessRequests === "string") {
              datasetCopy.accessRequests = JSON.parse(datasetCopy.accessRequests);
            }
            if (typeof datasetCopy.sharedWith === "string") {
              datasetCopy.sharedWith = JSON.parse(datasetCopy.sharedWith);
            }
            const ownerUser = users.find(user => user.address === datasetCopy.owner);
            console.log(ownerUser)
            if (ownerUser) {
              setHealthcareType(ownerUser.healthcareType);
              setOrganizationName(ownerUser.organizationName);
            }
            setDatasetData(datasetCopy); 
          } else {
            console.error("Fetched dataset is null.");
          }
        })
        .catch((error) => {
          console.error("Failed to fetch dataset:", error);
        });
    }
  }, [id, dispatch]);

  let contentArray: FileData[] = [];

  if (datasetData && datasetData.content) {
    try {
      contentArray = typeof datasetData.content === 'string' 
        ? JSON.parse(datasetData.content) 
        : datasetData.content;
    } catch (error) {
      console.error("Failed to parse datasetData.content:", error);
      contentArray = [];
    }
  }
  
  const handleShare = () => {
    if (sharedAddress) {

      const payload = {
        datasetId: dataset.dataset_id,
        address: sharedAddress,
        files: dataset.content
          ? dataset.content.map((fileData) => fileData.name)
          : [],
      };

      dispatch(shareDataset(payload));

      setSharedAddress("");
    } else {
      console.log("Shared address is missing or empty.");
    }
  };

  const handleUnshare = (address: string) => {
    dispatch(unshareDataset({ datasetId: dataset.dataset_id, address }))
      .then(() => {
        return dispatch(fetchSingleDataset(id as string)).unwrap();
      })
      .then((updatedDataset) => {
        setDatasetData(updatedDataset);
      });
  };

  const handleRequestAccess = () => {
    if (currentUserAddress) {
      const requestPending = dataset.accessRequests
        ? dataset.accessRequests.includes(currentUserAddress)
        : false;
      if (!requestPending) {
        dispatch(
          requestDatasetAccess({
            dataset_id: dataset.dataset_id,
            requestor: currentUserAddress,
          })
        )
          .then(() => {
            return dispatch(fetchSingleDataset(id as string)).unwrap();
          })
          .then((updatedPatient) => {
            setDatasetData(updatedPatient);
          });
        //   dispatch(
        //     addNotification({
        //       address: patient.owner,
        //       notification: {
        //         id: uuid(),
        //         read: false,
        //         message: `${currentUserAddress} has requested access to patient ${patient.patient_id}`,
        //         patient_id: patient.patient_id,
        //       },
        //     })
        //   );
        // }
      }
    }
  };

  const handleCancelRequest = () => {
    if (currentUserAddress) {
      const requestPending = dataset.accessRequests
        ? dataset.accessRequests.includes(currentUserAddress)
        : false;
      if (requestPending && currentUserAddress) {
        dispatch(
          cancelDatasetRequest({
            dataset_id: dataset.dataset_id,
            requestor: currentUserAddress,
          })
        )
          .then(() => {
            return dispatch(fetchSingleDataset(id as string)).unwrap();
          })
          .then((updatedDataset) => {
            setDatasetData(updatedDataset);
          });
      }
    }
  };

  const handleAcceptRequest = (requestor: string, files: string[]) => {
    dispatch(
      acceptDatasetAccessRequest({
        datasetId: dataset.dataset_id,
        requestor,
        files,
      })
    )
      .then(() => {
        return dispatch(fetchSingleDataset(id as string)).unwrap();
      })
      .then((updatedDataset) => {
        setDatasetData(updatedDataset);
      });
    // dispatch(
    //   addNotification({
    //     address: requestor,
    //     notification: {
    //       id: uuid(),
    //       read: false,
    //       message: `Your access request to patient ${dataset.patient_id} has been accepted`,
    //       patient_id: dataset.patient_id,
    //     },
    //   })
    // );
  };

  const handleRejectRequest = (requestor: string) => {
    dispatch(
      rejectDatasetAccessRequest({ datasetId: dataset.dataset_id, requestor })
    )
      .then(() => {
        return dispatch(fetchSingleDataset(id as string)).unwrap();
      })
      .then((updatedDataset) => {
        setDatasetData(updatedDataset);
      });
    // dispatch(
    //   addNotification({
    //     address: requestor,
    //     notification: {
    //       id: uuid(),
    //       read: false,
    //       message: `Your access request to dataset ${dataset.dataset_id} has been rejected`,
    //       dataset_id: dataset.dataset_id,
    //     },
    //   })
    // );
  };

  const handleUpdateSharedFiles = (address: string, files: string[]) => {
    if (selectedUsers) {
      dispatch(
        updateSharedFiles({
          datasetId: dataset.dataset_id,
          address: selectedUsers,
          files,
        })
      )
        .then(() => {
          return dispatch(fetchSingleDataset(id as string)).unwrap();
        })
        .then((updatedDataset) => {
          setDatasetData(updatedDataset);
        });
    }
  };

  let content = datasetData?.content;

  if (typeof content === "string") {
    try {
      content = JSON.parse(content);
    } catch (error) {
      console.error("Failed to parse datasetData.content:", error);
    }
  }

  // const fetchFileFromIPFS = async (cid: string): Promise<string> => {
  //   try {
  //     const chunks: Uint8Array[] = [];
  //     for await (const chunk of ipfs.cat(cid)) {
  //       chunks.push(chunk);
  //     }

  //     const blob = new Blob(chunks, { type: "application/octet-stream" });

  //     return new Promise<string>((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         if (typeof reader.result === "string") {
  //           const base64 = reader.result.split(",")[1];
  //           resolve(base64);
  //         } else {
  //           reject(new Error("Failed to convert Blob to base64"));
  //         }
  //       };
  //       reader.readAsDataURL(blob);
  //     });
  //   } catch (error) {
  //     console.error(`Failed to fetch file from IPFS with CID ${cid}:`, error);
  //     return "";
  //   }
  // };

  const handleFileClick = async (file: FileData) => {
    // if (file.ipfsCID) {
    //   const base64Content = await fetchFileFromIPFS(file.ipfsCID);
    //   if (base64Content) {
    //     console.log(base64Content);
    //   }
    // }
  };

  const handleAddFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      let fileContents: FileData[] = [];

      for (const file of files) {
        const reader = new FileReader();

        // const result: Promise<FileData> = new Promise((resolve, reject) => {
        //   reader.onloadend = async () => {
        //     if (typeof reader.result === "string") {
        //       const base64String = reader.result.split(",")[1];

        //       const buffer = Buffer.from(base64String, "base64");
        //       try {
        //         const ipfsResult = await ipfs.add(buffer);
        //         resolve({
        //           base64: "",
        //           name: file.name,
        //           dataType: "",
        //           ipfsCID: ipfsResult.path,
        //         });
        //       } catch (ipfsError) {
        //         console.error("Error uploading to IPFS:", ipfsError);
        //         reject(ipfsError);
        //       }
        //     } else {
        //       reject(new Error("Unexpected result type from FileReader"));
        //     }
        //   };
        // });

        // reader.readAsDataURL(file);

        // const fileData = await result;
        // fileContents.push(fileData);

        // dispatch(
        //   addFileToDataset({
        //     datasetId: dataset.dataset_id,
        //     file: fileData,
        //     owner: currentUserAddress || "",
        //   })
        // );
      }

      const newFilesData = [...datasetData, ...fileContents];
      setDatasetData(newFilesData);
      dispatch(setFormContent(newFilesData));
    }
  };

  const handleRemoveFile = (fileName: string) => {
    if (currentUserAddress === dataset?.owner) {
      dispatch(
        removeFileFromDataset({ datasetId: dataset.dataset_id, fileName })
      );
    }
  };

  if (!datasetData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-4 mt-10 mx-4">
      <div className="w-full lg:w-[20rem] bg-gray-700 text-white shadow-md rounded-md overflow-hidden m-4 border-2 border-gray-600">
        <EntityHeader
          entityId={datasetData.dataset_id}
          owner={datasetData.owner}
          healthcareType={healthcareType}
          organizationName={organizationName}
          createdDate={datasetData.createdDate}
          entityType="Dataset"
        />
        <div className="px-6 py-2 space-y-4 border-t border-gray-700">
          {user.currentUserAddress === datasetData.owner && (
            <EntityOwnerActions
              newOwner={newOwner}
              setNewOwner={setNewOwner}
              handleTransfer={handleTransfer}
              sharedAddress={sharedAddress}
              setSharedAddress={setSharedAddress}
              handleShare={handleShare}
              sharedWith={dataset.sharedWith}
              handleUnshare={handleUnshare}
              selectedFiles={selectedFiles}
              setSelectedFiles={setSelectedFiles}
              selectedUser={selectedUsers}
              setSelectedUser={setSelectedUsers}
              handleUpdateSharedFiles={handleUpdateSharedFiles}
              entity={dataset}
            />
          )}
          <RequestAccess
            itemId={id as string}
            handleRequestAccess={handleRequestAccess}
            requestPending={
              dataset.accessRequests
                ? dataset.accessRequests.includes(currentUserAddress || "")
                : false
            }
            accessRequests={dataset.accessRequests || []}
            handleCancelRequest={handleCancelRequest}
            handleAcceptRequest={handleAcceptRequest}
            handleRejectRequest={handleRejectRequest}
            accessList={
              dataset.sharedWith && typeof dataset.sharedWith === "object"
                ? Object.keys(dataset.sharedWith)
                : []
            }
            currentUserAddress={currentUserAddress || ""}
            ownerAddress={dataset.owner}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            selectedRequestor={selectedRequestor}
            setSelectedRequestor={setSelectedRequestor}
          />
        </div>
        <GenericHistory title="Dataset History" data={datasetData.history} />
      </div>

      {(Object.keys(datasetData.sharedWith || {}).includes(
        user.currentUserAddress || ""
      ) ||
        user.currentUserAddress === datasetData.owner) && (
        <div className="w-full lg:w-[40rem] bg-gray-700 text-white rounded-md overflow-hidden m-4 border-2 border-gray-600">
          <DataFileSection
            dataId={id as string}
            content={dataset.content}
            owner={dataset.owner}
            sharedWith={dataset.sharedWith}
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
export default DatasetPage;
