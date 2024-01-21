// src/redux/slices/patientSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Patient, FileData } from "../../objects/types";

const initialState: Patient[] = [];

export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async () => {
    const response = await fetch("/api/patients");
    const patients = await response.json();
    return patients;
  }
);

export const createPatient = createAsyncThunk(
  "patients/createPatient",
  async (patient: Patient) => {
    const response = await fetch("/api/patients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patient),
    });
    const patientData = await response.json();
    return patientData;
  }
);

export const deletePatient = createAsyncThunk(
  "patients/deletePatient",
  async (patientId: string) => {
    const response = await fetch(`/api/patients/${patientId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete patient");
    }
    return patientId;
  }
);

export const fetchSinglePatient = createAsyncThunk(
  "patients/fetchSinglePatient",
  async (patient_id: string) => {
    const response = await fetch(`/api/patients/${patient_id}`);
    const patient = await response.json();
    return patient;
  }
);

export const transferOwnership = createAsyncThunk(
  "patients/`transferOwnership`",
  async (payload: { patientId: string; newOwner: string }) => {
    console.log("payload:", payload);
    const response = await fetch(
      `/api/patients/${payload.patientId}/transfer`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newOwner: payload.newOwner }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to transfer ownership");
    }
    const data = await response.json();
    return data;
  }
);

export const sharePatient = createAsyncThunk(
  "patients/sharePatient",
  async (payload: { patientId: string; address: string; files: string[] }) => {
    const response = await fetch(
      `/api/patients/${payload.patientId}/accept-request`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: payload.address,
          files: payload.files,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to share patient");
    }
    return payload;
  }
);

export const unsharePatient = createAsyncThunk(
  "patients/unsharePatient",
  async (payload: { patientId: string; address: string }) => {
    const response = await fetch(`/api/patients/${payload.patientId}/unshare`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: payload.address,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to unshare patient");
    }
    const data = await response.json();
    return data;
  }
);

export const requestAccess = createAsyncThunk(
  "patients/requestAccess",
  async (payload: { patient_id: string; requestor: string }) => {
    const response = await fetch(
      `/api/patients/${payload.patient_id}/request`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestor: payload.requestor,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to request access");
    }
    const data = await response.json();
    return data;
  }
);

export const acceptAccessRequest = createAsyncThunk(
  "patients/acceptAccessRequest",
  async (
    payload: {
      patientId: string;
      requestor: string;
      files: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(
        `/api/patients/${payload.patientId}/accept-request`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedPatient = await response.json();
      return updatedPatient;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectAccessRequest = createAsyncThunk(
  "patients/rejectAccessRequest",
  async (payload: { patientId: string; requestor: string }) => {
    const response = await fetch(
      `/api/patients/${payload.patientId}/cancel-request`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to reject access request");
    }
    return payload;
  }
);

export const cancelRequest = createAsyncThunk(
  "patients/cancelRequest",
  async (payload: { patient_id: string; requestor: string }) => {
    const response = await fetch(
      `/api/patients/${payload.patient_id}/cancel-request`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to cancel request");
    }
    return payload;
  }
);

export const removeFile = createAsyncThunk(
  "patients/removeFile",
  async (payload: { patientId: string; fileName: string }) => {
    const response = await fetch(
      `/api/patients/${payload.patientId}/remove-file`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: payload.fileName,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to remove file");
    }
    return payload;
  }
);

export const updateSharedFiles = createAsyncThunk(
  "patients/updateSharedFiles",
  async (payload: { patientId: string; address: string; files: string[] }) => {
    const response = await fetch(
      `/api/patients/${payload.patientId}/update-shared`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: payload.address,
          files: payload.files,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update shared files");
    }
    return payload;
  }
);

export const addFile = createAsyncThunk(
  "patients/addFile",
  async (payload: { patientId: string; file: FileData; owner: string }) => {
    const response = await fetch(
      `/api/patients/${payload.patientId}/add-file`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: payload.file,
          owner: payload.owner,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to add file");
    }
    return payload;
  }
);

export const patientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.fulfilled, (state, action) => {
        return Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(createPatient.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(fetchSinglePatient.fulfilled, (state, action) => {
        const patientIndex = state.findIndex(
          (patient) => patient.patient_id === action.payload.patient_id
        );
        if (patientIndex !== -1) {
          state[patientIndex] = action.payload;
        } else {
          state.push(action.payload);
        }
      })
      .addCase(deletePatient.fulfilled, (state, action) => {
        return state.filter((patient) => patient.patient_id !== action.payload);
      })
      .addCase(transferOwnership.fulfilled, (state, action) => {
        const { patientId, newOwner } = action.payload;
        const patient = state.find(
          (patient) => patient.patient_id === patientId
        );
        if (patient) {
          if (!Array.isArray(patient.history)) {
            patient.history = [];
          }
          patient.owner = newOwner;
          patient.history.push({
            requestor: newOwner,
            type: "transfer",
            timestamp: new Date().toISOString(),
          });
        }
      })
      .addCase(sharePatient.fulfilled, (state, action) => {
        const { patientId, address, files } = action.payload;
        const patient = state.find(
          (patient) => patient.patient_id === patientId
        );
        if (patient) {
          if (!patient.sharedWith) {
            patient.sharedWith = {};
          }
          patient.sharedWith[address] = files;
          patient.history.push({
            requestor: address,
            type: "shared",
            timestamp: new Date().toISOString(),
          });
        }
      })
      .addCase(unsharePatient.fulfilled, (state, action) => {
        const { patientId, address } = action.payload;
        const patient = state.find(
          (patient) => patient.patient_id === patientId
        );
        if (patient && patient.sharedWith && patient.sharedWith[address]) {
          delete patient.sharedWith[address];
          patient.history.push({
            requestor: address,
            type: "unshared",
            timestamp: new Date().toISOString(),
          });
        }
      })
      .addCase(removeFile.fulfilled, (state, action) => {
        const { patientId } = action.payload;
        const patient = state.find(
          (patient) => patient.patient_id === patientId
        );
        if (patient) {
          if (!Array.isArray(patient.content)) {
            patient.content = [];
          }

          if (!Array.isArray(patient.history)) {
            patient.history = [];
          }

          patient.history.push({
            requestor: patient.owner,
            type: "removed",
            timestamp: new Date().toISOString(),
          });
        }
      })
      .addCase(updateSharedFiles.fulfilled, (state, action) => {
        const { patientId, address, files } = action.payload;
        const patient = state.find(
          (patient) => patient.patient_id === patientId
        );
        if (patient) {
          if (typeof patient.sharedWith === "string") {
            try {
              patient.sharedWith = JSON.parse(patient.sharedWith);
            } catch (error) {
              console.error("Failed to parse sharedWith:", error);
              patient.sharedWith = {};
            }
          }
          patient.sharedWith[address] = files;
          if (!Array.isArray(patient.history)) {
            patient.history = [];
          }
          patient.history.push({
            requestor: address,
            type: "updated",
            timestamp: new Date().toISOString(),
          });
        }
      })
      .addCase(addFile.fulfilled, (state, action) => {
        const { patientId, file } = action.payload;
        const patient = state.find(
          (patient) => patient.patient_id === patientId
        );
        if (patient) {
          if (!Array.isArray(patient.content)) {
            patient.content = [];
          }
          patient.content.push(file);

          if (!Array.isArray(patient.history)) {
            patient.history = [];
          }

          patient.history.push({
            requestor: patient.owner,
            type: "added",
            timestamp: new Date().toISOString(),
          });
        }
      })
      .addCase(requestAccess.fulfilled, (state, action) => {
        const updatedPatient = action.payload;
        const patientIndex = state.findIndex(
          (patient) => patient.patient_id === updatedPatient.patient_id
        );
        if (patientIndex !== -1) {
          state[patientIndex] = updatedPatient;
        }
      })
      .addCase(cancelRequest.fulfilled, (state, action) => {
        const { patient_id, requestor } = action.payload;
        const patient = state.find((p) => p.patient_id === patient_id);
        if (patient) {
          patient.accessRequests = Array.isArray(patient.accessRequests)
            ? patient.accessRequests.filter((req) => req !== requestor)
            : [];

          patient.history = Array.isArray(patient.history)
            ? [
                ...patient.history,
                {
                  requestor,
                  type: "cancelled",
                  timestamp: new Date().toISOString(),
                },
              ]
            : [
                {
                  requestor,
                  type: "cancelled",
                  timestamp: new Date().toISOString(),
                },
              ];
        }
      })
      .addCase(acceptAccessRequest.fulfilled, (state, action) => {
        const updatedPatient = action.payload;
        const patientIndex = state.findIndex(
          (patient) => patient.patient_id === updatedPatient.patient_id
        );
        if (patientIndex !== -1) {
          state[patientIndex] = updatedPatient;
        }
      })
      .addCase(rejectAccessRequest.fulfilled, (state, action) => {
        const { patientId, requestor } = action.payload;
        const patient = state.find(
          (patient) => patient.patient_id === patientId
        );
        if (patient) {
          if (typeof patient.accessRequests === "string") {
            try {
              patient.accessRequests = JSON.parse(patient.accessRequests);
            } catch (error) {
              console.error("Failed to parse accessRequests:", error);
              patient.accessRequests = [];
            }
          }
          if (!Array.isArray(patient.accessRequests)) {
            console.error(
              `patient.accessRequests is not an array for patient with ID: ${patient.patient_id}. It's currently: `,
              patient.accessRequests
            );
            patient.accessRequests = [];
          }
          patient.accessRequests = patient.accessRequests.filter(
            (req) => req !== requestor
          );
          console.log(`[rejectAccessRequest] After:`, patient.accessRequests);

          if (!Array.isArray(patient.history)) {
            patient.history = [];
          }
          patient.history.push({
            requestor,
            type: "rejected",
            timestamp: new Date().toISOString(),
          });
        }
      });
  },
});

export default patientSlice.reducer;
