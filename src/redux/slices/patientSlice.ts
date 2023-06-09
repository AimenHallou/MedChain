// src/redux/slices/patientSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Patient,FileData } from "../../objects/types";
import testPatients from "../../data/testPatients";

const initialState: Patient[] = testPatients;

export const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    addPatient: (state, action: PayloadAction<Omit<Patient, "id">>) => {
      const newId = action.payload.patient_id;
      state.push({
        id: newId,
        history: [`Patient created on ${new Date().toISOString()}`],
        accessRequests: [],
        ...action.payload,
        content: action.payload.content,
      });
    },    
    fetchPublishedPatients: (state, action: PayloadAction<string>) => {
      const ownerAddress = action.payload;
      return state
        .filter((patient) => patient.owner === ownerAddress)
        .map((patient) => {
          const { id, patient_id, owner, ownerTitle, createdDate, content, sharedWith, history, accessRequests } = patient;
    
          let allowedContent = null;
          if (content && sharedWith[ownerAddress]) {
            const allowedFileNames = sharedWith[ownerAddress];
            allowedContent = content.filter(file => allowedFileNames.includes(file.name));
          }
    
          return { id, patient_id, owner, ownerTitle, createdDate, content: allowedContent, sharedWith, history, accessRequests };
        });
    },    
    updatePatient: (
      state,
      action: PayloadAction<
        Pick<Patient, "id" | "patient_id" | "content">
      >
    ) => {
      const { id, patient_id, content } = action.payload;
      const patientIndex = state.findIndex((patient) => patient.id === id);
      if (patientIndex !== -1) {
        state[patientIndex].patient_id = patient_id;
        state[patientIndex].content = content;
        state[patientIndex].history.push(
          `Patient updated on ${new Date().toISOString()}`
        );
      }
    },
    transferOwnership: (
      state,
      action: PayloadAction<{ patientId: string; newOwner: string }>
    ) => {
      const { patientId, newOwner } = action.payload;
      const patientIndex = state.findIndex((patient) => patient.id === patientId);
      if (patientIndex !== -1) {
        state[patientIndex].owner = newOwner;
        state[patientIndex].history.push(
          `Ownership transferred to ${newOwner} on ${new Date().toISOString()}`
        );
      }
    },
    sharePatient: (
      state,
      action: PayloadAction<{ patientId: string; address: string; files: string[] }>
    ) => {
      const { patientId, address, files } = action.payload;
      const patient = state.find((patient) => patient.id === patientId);
      if (patient) {
        patient.sharedWith[address] = files;
        patient.history.push(
          `Patient shared with ${address} on ${new Date().toISOString()}`
        );
      }
    },
    unsharePatient: (
      state,
      action: PayloadAction<{ patientId: string; address: string }>
    ) => {
      const { patientId, address } = action.payload;
      const patient = state.find((patient) => patient.id === patientId);
      if (patient && patient.sharedWith[address]) {
        delete patient.sharedWith[address];
        patient.history.push(
          `Patient unshared with ${address} on ${new Date().toISOString()}`
        );
      }
    },
    requestAccess: (
      state,
      action: PayloadAction<{ patientId: string; requestor: string }>
    ) => {
      const { patientId, requestor } = action.payload;
      const patient = state.find((patient) => patient.id === patientId);
      if (patient && !patient.accessRequests.includes(requestor)) {
        patient.accessRequests.push(requestor);
        patient.history.push(
          `Access requested by ${requestor} on ${new Date().toISOString()}`
        );
      }
    },
    cancelRequest: (
      state,
      action: PayloadAction<{ patientId: string; requestor: string }>
    ) => {
      const { patientId, requestor } = action.payload;
      const patient = state.find((patient) => patient.id === patientId);
      if (patient && patient.accessRequests.includes(requestor)) {
        patient.accessRequests = patient.accessRequests.filter(
          (request) => request !== requestor
        );
        patient.history.push(
          `Patient request for access by ${requestor} was cancelled`
        );
      }
    },    
    acceptAccessRequest: (
      state,
      action: PayloadAction<{ patientId: string; requestor: string; files: string[] }>
    ) => {
      const { patientId, requestor, files } = action.payload;
      const patient = state.find((patient) => patient.id === patientId);
      if (patient && patient.accessRequests.includes(requestor)) {
        patient.accessRequests = patient.accessRequests.filter(
          (request) => request !== requestor
        );
        patient.sharedWith[requestor] = files;
        patient.history.push(
          `Access request accepted for ${requestor} on ${new Date().toISOString()}`
        );
      }
    },      
    rejectAccessRequest: (
      state,
      action: PayloadAction<{ patientId: string; requestor: string }>
    ) => {
      const { patientId, requestor } = action.payload;
      const patient = state.find((patient) => patient.id === patientId);
      if (patient && patient.accessRequests.includes(requestor)) {
        patient.accessRequests = patient.accessRequests.filter(
          (request) => request !== requestor
        );
        patient.history.push(
          `Patient request rejected for ${requestor} on ${new Date().toISOString()}`
        );
      }
    },
    removeFile: (
      state,
      action: PayloadAction<{ patientId: string; fileName: string }>
    ) => {
      const { patientId, fileName } = action.payload;
      const patient = state.find((patient) => patient.id === patientId);
      if (patient) {
        const fileIndex = patient.content.findIndex((file) => file.name === fileName);
        if (fileIndex !== -1) {
          patient.content.splice(fileIndex, 1);
          patient.history.push(
            `File ${fileName} removed on ${new Date().toISOString()}`
          );
          for (let address in patient.sharedWith) {
            patient.sharedWith[address] = patient.sharedWith[address].filter(file => file !== fileName);
          }
        }
      }
    },   
    updateSharedFiles: (
      state,
      action: PayloadAction<{ patientId: string; address: string; files: string[] }>
    ) => {
      const { patientId, address, files } = action.payload;
      const patient = state.find((patient) => patient.id === patientId);
      if (patient && patient.sharedWith[address]) {
        patient.sharedWith[address] = files;
        patient.history.push(
          `Files updated for ${address} on ${new Date().toISOString()}`
        );
      }
    },  
    addFile: (
      state,
      action: PayloadAction<{ patientId: string; file: FileData }>
    ) => {
      const { patientId, file } = action.payload;
      const patientIndex = state.findIndex((patient) => patient.id === patientId);
      if (patientIndex !== -1) {
        const patient = state[patientIndex];
        state[patientIndex] = {
          ...patient,
          content: [...patient.content, file],
          history: [
            ...patient.history,
            `New files added on ${new Date().toISOString()}`
          ],
        };
      }
    },         
  },
});

export const {
  addPatient,
  fetchPublishedPatients,
  updatePatient,
  transferOwnership,
  sharePatient,
  unsharePatient,
  requestAccess,
  cancelRequest,
  acceptAccessRequest,
  rejectAccessRequest,
  removeFile,
  updateSharedFiles,
  addFile,
} = patientSlice.actions;

export default patientSlice.reducer;
