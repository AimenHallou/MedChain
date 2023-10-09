// src/redux/slices/datasetSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Dataset } from "../../objects/types";

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
      });
  },
});

export default datasetSlice.reducer;
