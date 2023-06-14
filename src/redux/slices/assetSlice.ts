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
      state.push({ id: newId, ...action.payload });
    },
    fetchPublishedAssets: (state, action: PayloadAction<string>) => {
      return state.filter(asset => asset.owner === action.payload);
    },
    updateAsset: (state, action: PayloadAction<Pick<Asset, 'id' | 'title' | 'description' | 'price'| 'content'| 'restricted'>>) => {
      const { id, title, description, price, content, restricted } = action.payload;
      const assetIndex = state.findIndex(asset => asset.id === id);
      if (assetIndex !== -1) {
        state[assetIndex].title = title;
        state[assetIndex].description = description;
        state[assetIndex].price = price;
        state[assetIndex].content = content;
        state[assetIndex].restricted = restricted;
      }
    },
    transferOwnership: (state, action: PayloadAction<{ assetId: string, newOwner: string }>) => {
      const { assetId, newOwner } = action.payload;
      const assetIndex = state.findIndex(asset => asset.id === assetId);
      if (assetIndex !== -1) {
        state[assetIndex].owner = newOwner;
      }
    },
    shareAsset: (state, action: PayloadAction<{ assetId: string; username: string }>) => {
      const { assetId, username } = action.payload;
      const asset = state.find(asset => asset.id === assetId);
      if (asset && asset.restricted) {
        asset.sharedWith.push(username);
      }
    },
    unshareAsset: (state, action: PayloadAction<{ assetId: string; username: string }>) => {
      const { assetId, username } = action.payload;
      const asset = state.find(asset => asset.id === assetId);
      if (asset && asset.restricted) {
        const index = asset.sharedWith.indexOf(username);
        if (index !== -1) {
          asset.sharedWith.splice(index, 1);
        }
      }
    },    
  },
});

export const { addAsset, fetchPublishedAssets, updateAsset, transferOwnership, shareAsset, unshareAsset } = assetsSlice.actions;

export default assetsSlice.reducer;
