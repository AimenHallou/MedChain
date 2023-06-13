// src/redux/slices/formSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Asset } from '../../objects/types'

interface FormState extends Omit<Asset, 'id'> {}

const initialState: FormState = {
  title: '',
  description: '',
  owner: '',
  createdDate: '',
  price: '',
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setField: (state, action: PayloadAction<{ field: keyof FormState; value: string }>) => {
      state[action.payload.field] = action.payload.value;
    },
    resetForm: () => initialState,
  },
});

export const { setField, resetForm } = formSlice.actions;

export default formSlice.reducer;
