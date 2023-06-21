// src/redux/slices/assetsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Asset } from "../../objects/types";
import testAssets from "../../data/testAssets";
import { v4 as uuid } from "uuid";

const initialState: Asset[] = testAssets;

export const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    addAsset: (state, action: PayloadAction<Omit<Asset, "id">>) => {
      const newId = uuid();
      state.push({
        id: newId,
        history: [`Asset created on ${new Date().toISOString()}`],
        accessRequests: [],
        ...action.payload,
        content: action.payload.content,
      });
    },
    fetchPublishedAssets: (state, action: PayloadAction<string>) => {
      return state.filter((asset) => asset.owner === action.payload);
    },
    updateAsset: (
      state,
      action: PayloadAction<
        Pick<Asset, "id" | "title" | "content">
      >
    ) => {
      const { id, title, content } = action.payload;
      const assetIndex = state.findIndex((asset) => asset.id === id);
      if (assetIndex !== -1) {
        state[assetIndex].title = title;
        state[assetIndex].content = content;
        state[assetIndex].history.push(
          `Asset updated on ${new Date().toISOString()}`
        );
      }
    },
    transferOwnership: (
      state,
      action: PayloadAction<{ assetId: string; newOwner: string }>
    ) => {
      const { assetId, newOwner } = action.payload;
      const assetIndex = state.findIndex((asset) => asset.id === assetId);
      if (assetIndex !== -1) {
        state[assetIndex].owner = newOwner;
        state[assetIndex].history.push(
          `Ownership transferred to ${newOwner} on ${new Date().toISOString()}`
        );
      }
    },
    shareAsset: (
      state,
      action: PayloadAction<{ assetId: string; address: string }>
    ) => {
      const { assetId, address } = action.payload;
      const asset = state.find((asset) => asset.id === assetId);
      if (asset) {
        asset.sharedWith.push(address);
        asset.history.push(
          `Asset shared with ${address} on ${new Date().toISOString()}`
        );
      }
    },
    unshareAsset: (
      state,
      action: PayloadAction<{ assetId: string; address: string }>
    ) => {
      const { assetId, address } = action.payload;
      const asset = state.find((asset) => asset.id === assetId);
      if (asset) {
        const index = asset.sharedWith.indexOf(address);
        if (index !== -1) {
          asset.sharedWith.splice(index, 1);
          asset.history.push(
            `Asset unshared with ${address} on ${new Date().toISOString()}`
          );
        }
      }
    },
    requestAccess: (
      state,
      action: PayloadAction<{ assetId: string; requestor: string }>
    ) => {
      const { assetId, requestor } = action.payload;
      const asset = state.find((asset) => asset.id === assetId);
      if (asset && !asset.accessRequests.includes(requestor)) {
        asset.accessRequests.push(requestor);
        asset.history.push(
          `Access requested by ${requestor} on ${new Date().toISOString()}`
        );
      }
    },
    acceptAccessRequest: (
      state,
      action: PayloadAction<{ assetId: string; requestor: string }>
    ) => {
      const { assetId, requestor } = action.payload;
      const asset = state.find((asset) => asset.id === assetId);
      if (asset && asset.accessRequests.includes(requestor)) {
        asset.accessRequests = asset.accessRequests.filter(
          (request) => request !== requestor
        );
        asset.sharedWith.push(requestor);
        asset.history.push(
          `Access request accepted for ${requestor} on ${new Date().toISOString()}`
        );
      }
    },
    rejectAccessRequest: (
      state,
      action: PayloadAction<{ assetId: string; requestor: string }>
    ) => {
      const { assetId, requestor } = action.payload;
      const asset = state.find((asset) => asset.id === assetId);
      if (asset && asset.accessRequests.includes(requestor)) {
        asset.accessRequests = asset.accessRequests.filter(
          (request) => request !== requestor
        );
        asset.history.push(
          `Access request rejected for ${requestor} on ${new Date().toISOString()}`
        );
      }
    },
  },
});

export const {
  addAsset,
  fetchPublishedAssets,
  updateAsset,
  transferOwnership,
  shareAsset,
  unshareAsset,
  requestAccess,
  acceptAccessRequest,
  rejectAccessRequest,
} = assetsSlice.actions;

export default assetsSlice.reducer;
