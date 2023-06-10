// src/redux/slices/formSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  title: string;
  description: string;
  price: string;
}

const initialState: FormState = {
  title: '',
  description: '',
  price: '',
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setPrice: (state, action: PayloadAction<string>) => {
      state.price = action.payload;
    },
  },
});

export const { setTitle, setDescription, setPrice } = formSlice.actions;

export default formSlice.reducer;
