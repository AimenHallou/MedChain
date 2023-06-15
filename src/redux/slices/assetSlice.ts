// src/redux/slices/assetsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Asset } from '../../objects/types';
import testAssets from '../../data/testAssets';

const initialState: Asset[] = testAssets;

export const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    addAsset: (state, action: PayloadAction<Omit<Asset, 'id'>>) => {
      const newId = (state.length + 1).toString();
      state.push({ id: newId, history: [`Asset created on ${new Date().toISOString()}`], ...action.payload });
    },
    fetchPublishedAssets: (state, action: PayloadAction<string>) => {
      return state.filter(asset => asset.owner === action.payload);
    },
    updateAsset: (state, action: PayloadAction<Pick<Asset, 'id' | 'title' | 'description' | 'content'>>) => {
      const { id, title, description, content } = action.payload;
      const assetIndex = state.findIndex(asset => asset.id === id);
      if (assetIndex !== -1) {
        state[assetIndex].title = title;
        state[assetIndex].description = description;
        state[assetIndex].content = content;
        state[assetIndex].history.push(`Asset updated on ${new Date().toISOString()}`);
      }
    },
    transferOwnership: (state, action: PayloadAction<{ assetId: string, newOwner: string }>) => {
      const { assetId, newOwner } = action.payload;
      const assetIndex = state.findIndex(asset => asset.id === assetId);
      if (assetIndex !== -1) {
        state[assetIndex].owner = newOwner;
        state[assetIndex].history.push(`Ownership transferred to ${newOwner} on ${new Date().toISOString()}`);
      }
    },
    shareAsset: (state, action: PayloadAction<{ assetId: string; username: string }>) => {
      const { assetId, username } = action.payload;
      const asset = state.find(asset => asset.id === assetId);
      if (asset) {
        asset.sharedWith.push(username);
        asset.history.push(`Asset shared with ${username} on ${new Date().toISOString()}`);
      }
    },
    unshareAsset: (state, action: PayloadAction<{ assetId: string; username: string }>) => {
      const { assetId, username } = action.payload;
      const asset = state.find(asset => asset.id === assetId);
      if (asset) {
        const index = asset.sharedWith.indexOf(username);
        if (index !== -1) {
          asset.sharedWith.splice(index, 1);
          asset.history.push(`Asset unshared with ${username} on ${new Date().toISOString()}`);
        }
      }
    },    
  },
});

export const { addAsset, fetchPublishedAssets, updateAsset, transferOwnership, shareAsset, unshareAsset } = assetsSlice.actions;

export default assetsSlice.reducer;
