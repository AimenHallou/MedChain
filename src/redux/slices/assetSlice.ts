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
  },
});

export const { addAsset, fetchPublishedAssets, updateAsset, transferOwnership } = assetsSlice.actions;

export default assetsSlice.reducer;
