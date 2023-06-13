// src/redux/slices/assetsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Asset } from '../../objects/types'; // Replace with the actual path to types.ts
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
  },
});

export const { addAsset } = assetsSlice.actions;

export default assetsSlice.reducer;
