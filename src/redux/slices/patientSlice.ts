// src/redux/slices/patientSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Patient } from "../../objects/types";
import testPatients from "../../data/testPatients";
import { v4 as uuid } from "uuid";

const initialState: Patient[] = testPatients;

export const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {
    addPatient: (state, action: PayloadAction<Omit<Patient, "id">>) => {
      const newId = uuid();
      state.push({
        id: newId,
        history: [`Patient created on ${new Date().toISOString()}`],
        accessRequests: [],
        ...action.payload,
        content: action.payload.content,
      });
    },
    fetchPublishedPatients: (state, action: PayloadAction<string>) => {
      return state.filter((patient) => patient.owner === action.payload);
    },
    updatePatient: (
      state,
      action: PayloadAction<
        Pick<Patient, "id" | "title" | "content">
      >
    ) => {
      const { id, title, content } = action.payload;
      const patientIndex = state.findIndex((patient) => patient.id === id);
      if (patientIndex !== -1) {
        state[patientIndex].title = title;
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
      action: PayloadAction<{ patientId: string; address: string }>
    ) => {
      const { patientId, address } = action.payload;
      const patient = state.find((patient) => patient.id === patientId);
      if (patient) {
        patient.sharedWith.push(address);
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
      if (patient) {
        const index = patient.sharedWith.indexOf(address);
        if (index !== -1) {
          patient.sharedWith.splice(index, 1);
          patient.history.push(
            `Patient unshared with ${address} on ${new Date().toISOString()}`
          );
        }
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
    acceptAccessRequest: (
      state,
      action: PayloadAction<{ patientId: string; requestor: string }>
    ) => {
      const { patientId, requestor } = action.payload;
      const patient = state.find((patient) => patient.id === patientId);
      if (patient && patient.accessRequests.includes(requestor)) {
        patient.accessRequests = patient.accessRequests.filter(
          (request) => request !== requestor
        );
        patient.sharedWith.push(requestor);
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
  acceptAccessRequest,
  rejectAccessRequest,
} = patientSlice.actions;

export default patientSlice.reducer;
