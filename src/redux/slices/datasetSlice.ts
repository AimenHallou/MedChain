// src/redux/slices/datasetSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Dataset, FileData } from "../../objects/types";

const initialState: Dataset[] = [];
const API_ENDPOINT = "http://localhost:3001";

export const fetchDatasets = createAsyncThunk(
  "datasets/fetchDatasets",
  async () => {
    const response = await fetch(`${API_ENDPOINT}/api/datasets`);
    const datasets = await response.json();
    return datasets;
  }
);

export const fetchSingleDataset = createAsyncThunk(
  "datasets/fetchSingleDataset",
  async (dataset_id: string) => {
    const response = await fetch(`${API_ENDPOINT}/api/datasets/${dataset_id}`);
    const dataset = await response.json();
    return dataset;
  }
);

export const createDataset = createAsyncThunk(
  "datasets/createDataset",
  async (dataset: Dataset) => {
    const response = await fetch(`${API_ENDPOINT}/api/datasets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataset),
    });
    const datasetData = await response.json();
    return datasetData;
  }
);

export const updateDataset = createAsyncThunk(
  "datasets/updateDataset",
  async (payload: { datasetId: string; updates: Partial<Dataset> }) => {
    const response = await fetch(
      `${API_ENDPOINT}/api/datasets/${payload.datasetId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload.updates),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update dataset");
    }
    return payload;
  }
);

export const deleteDataset = createAsyncThunk(
  "datasets/deleteDataset",
  async (datasetId: string) => {
    const response = await fetch(`${API_ENDPOINT}/api/datasets/${datasetId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete dataset");
    }
    return datasetId;
  }
);

export const shareDataset = createAsyncThunk(
  "datasets/shareDataset",
  async (payload: { datasetId: string; address: string; files: string[] }) => {
    const response = await fetch(
      `${API_ENDPOINT}/api/datasets/${payload.datasetId}/share`,
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
      throw new Error("Failed to share dataset");
    }
    return payload;
  }
);

export const unshareDataset = createAsyncThunk(
  "datasets/unshareDataset",
  async (payload: { datasetId: string; address: string }) => {
    const response = await fetch(
      `${API_ENDPOINT}/api/datasets/${payload.datasetId}/unshare`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: payload.address,
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to unshare dataset");
    }
    return payload;
  }
);

export const requestDatasetAccess = createAsyncThunk(
  "datasets/requestDatasetAccess",
  async (payload: { dataset_id: string; requestor: string }) => {
    const response = await fetch(
      `${API_ENDPOINT}/api/datasets/${payload.dataset_id}/request`,
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
      throw new Error("Failed to request dataset access");
    }
    return payload;
  }
);

export const acceptDatasetAccessRequest = createAsyncThunk(
  "datasets/acceptDatasetAccessRequest",
  async (payload: {
    datasetId: string;
    requestor: string;
    files: string[];
  }) => {
    const response = await fetch(
      `${API_ENDPOINT}/api/datasets/${payload.datasetId}/accept-request`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to accept dataset access request");
    }
    return payload;
  }
);

export const rejectDatasetAccessRequest = createAsyncThunk(
  "datasets/rejectDatasetAccessRequest",
  async (payload: { datasetId: string; requestor: string }) => {
    const response = await fetch(
      `${API_ENDPOINT}/api/datasets/${payload.datasetId}/reject-request`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to reject dataset access request");
    }
    return payload;
  }
);

export const cancelDatasetRequest = createAsyncThunk(
  "datasets/cancelDatasetRequest",
  async (payload: { dataset_id: string; requestor: string }) => {
    const response = await fetch(
      `${API_ENDPOINT}/api/datasets/${payload.dataset_id}/cancel-request`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to cancel dataset request");
    }
    return payload;
  }
);

export const removeFileFromDataset = createAsyncThunk(
  "datasets/removeFile",
  async (payload: { datasetId: string; fileName: string }) => {
    const response = await fetch(
      `${API_ENDPOINT}/api/datasets/${payload.datasetId}/remove-file`,
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
      throw new Error("Failed to remove file from dataset");
    }
    return payload;
  }
);

export const addFileToDataset = createAsyncThunk(
  "datasets/addFile",
  async (payload: { datasetId: string; file: FileData; owner: string }) => {
    const response = await fetch(
      `${API_ENDPOINT}/api/datasets/${payload.datasetId}/add-file`,
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
      throw new Error("Failed to add file to dataset");
    }
    return payload;
  }
);

export const transferDatasetOwnership = createAsyncThunk(
  "datasets/transferOwnership",
  async (payload: { datasetId: string; newOwner: string }) => {
    const response = await fetch(
      `/api/datasets/${payload.datasetId}/transfer`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newOwner: payload.newOwner }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to transfer dataset ownership");
    }
    return payload;
  }
);

export const updateSharedFiles = createAsyncThunk(
  "datasets/updateSharedFiles",
  async (payload: { datasetId: string; address: string; files: string[] }) => {
    const response = await fetch(
      `${API_ENDPOINT}/api/datasets/${payload.datasetId}/update-shared`,
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
      throw new Error("Failed to update shared files for dataset");
    }
    return payload;
  }
);

export const datasetSlice = createSlice({
  name: "datasets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasets.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchSingleDataset.fulfilled, (state, action) => {
        const index = state.findIndex(
          (dataset) => dataset.dataset_id === action.payload.dataset_id
        );
        if (index !== -1) {
          state[index] = action.payload;
        } else {
          state.push(action.payload);
        }
      })
      .addCase(createDataset.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateDataset.fulfilled, (state, action) => {
        const index = state.findIndex(
          (dataset) => dataset.dataset_id === action.payload.datasetId
        );
        if (index !== -1) {
          state[index] = { ...state[index], ...action.payload.updates };
        }
      })
      .addCase(deleteDataset.fulfilled, (state, action) => {
        const index = state.findIndex(
          (dataset) => dataset.dataset_id === action.payload
        );
        if (index !== -1) {
          state.splice(index, 1);
        }
      })
      .addCase(shareDataset.fulfilled, (state, action) => {
        const { datasetId, address, files } = action.payload;
        const dataset = state.find(
          (dataset) => dataset.dataset_id === datasetId
        );
        if (dataset) {
          if (!dataset.sharedWith) {
            dataset.sharedWith = {};
          }
          dataset.sharedWith[address] = files;
          dataset.history.push(
            `Shared with ${address} on ${new Date().toISOString()}`
          );
        }
      })
      .addCase(unshareDataset.fulfilled, (state, action) => {
        const { datasetId, address } = action.payload;
        const dataset = state.find(
          (dataset) => dataset.dataset_id === datasetId
        );
        if (dataset && dataset.sharedWith && dataset.sharedWith[address]) {
          delete dataset.sharedWith[address];
          dataset.history.push(
            `Unshared with ${address} on ${new Date().toISOString()}`
          );
        }
      })
      .addCase(requestDatasetAccess.fulfilled, (state, action) => {
        const { dataset_id, requestor } = action.payload;
        const dataset = state.find(
          (dataset) => dataset.dataset_id === dataset_id
        );
        if (dataset) {
          if (!Array.isArray(dataset.accessRequests)) {
            dataset.accessRequests = [];
          }
          if (!dataset.accessRequests.includes(requestor)) {
            dataset.accessRequests.push(requestor);
          }
          dataset.history.push(
            `Access requested by ${requestor} on ${new Date().toISOString()}`
          );
        }
      })
      .addCase(acceptDatasetAccessRequest.fulfilled, (state, action) => {
        const { datasetId, requestor, files } = action.payload;
        const dataset = state.find(
          (dataset) => dataset.dataset_id === datasetId
        );
        if (dataset) {
          if (!Array.isArray(dataset.accessRequests)) {
            dataset.accessRequests = [];
          }
          dataset.accessRequests = dataset.accessRequests.filter(
            (req) => req !== requestor
          );
          dataset.history.push(
            `Access request accepted for ${requestor} on ${new Date().toISOString()}`
          );
        }
      })
      .addCase(rejectDatasetAccessRequest.fulfilled, (state, action) => {
        const { datasetId, requestor } = action.payload;
        const dataset = state.find(
          (dataset) => dataset.dataset_id === datasetId
        );
        if (dataset) {
          if (!Array.isArray(dataset.accessRequests)) {
            dataset.accessRequests = [];
          }
          dataset.accessRequests = dataset.accessRequests.filter(
            (req) => req !== requestor
          );
          dataset.history.push(
            `Access request rejected for ${requestor} on ${new Date().toISOString()}`
          );
        }
      })
      .addCase(cancelDatasetRequest.fulfilled, (state, action) => {
        const { dataset_id, requestor } = action.payload;
        const dataset = state.find(
          (dataset) => dataset.dataset_id === dataset_id
        );
        if (dataset) {
          if (!Array.isArray(dataset.accessRequests)) {
            dataset.accessRequests = [];
          }
          dataset.accessRequests = dataset.accessRequests.filter(
            (req) => req !== requestor
          );
          dataset.history.push(
            `Access request cancelled by ${requestor} on ${new Date().toISOString()}`
          );
        }
      })
      .addCase(addFileToDataset.fulfilled, (state, action) => {
        const { datasetId, file } = action.payload;
        const dataset = state.find(
          (dataset) => dataset.dataset_id === datasetId
        );
        if (dataset) {
          if (!Array.isArray(dataset.content)) {
            dataset.content = [];
          }
          dataset.content.push(file);
          dataset.history.push(`File added on ${new Date().toISOString()}`);
        }
      })
      .addCase(removeFileFromDataset.fulfilled, (state, action) => {
        const { datasetId, fileName } = action.payload;
        const dataset = state.find(
          (dataset) => dataset.dataset_id === datasetId
        );
        if (dataset) {
          if (Array.isArray(dataset.content)) {
            dataset.content = dataset.content.filter(
              (content) => content.name !== fileName
            );
            dataset.history.push(`File removed on ${new Date().toISOString()}`);
          }
        }
      })
      .addCase(transferDatasetOwnership.fulfilled, (state, action) => {
        const { datasetId, newOwner } = action.payload;
        const dataset = state.find(
          (dataset) => dataset.dataset_id === datasetId
        );
        if (dataset) {
          dataset.owner = newOwner;
          dataset.history.push(
            `Ownership transferred to ${newOwner} on ${new Date().toISOString()}`
          );
        }
      })
      .addCase(updateSharedFiles.fulfilled, (state, action) => {
        const { datasetId, address, files } = action.payload;
        const dataset = state.find(
          (dataset) => dataset.dataset_id === datasetId
        );
        if (dataset) {
          if (typeof dataset.sharedWith === "string") {
            try {
              dataset.sharedWith = JSON.parse(dataset.sharedWith);
            } catch (error) {
              console.error("Failed to parse sharedWith:", error);
              dataset.sharedWith = {};
            }
          }
          dataset.sharedWith[address] = files;
          if (!Array.isArray(dataset.history)) {
            dataset.history = [];
          }
          dataset.history.push(
            `Shared files updated for ${address} on ${new Date().toISOString()}`
          );
        }
      })
      
  },
});

export default datasetSlice.reducer;
