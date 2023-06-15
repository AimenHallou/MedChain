// src/redux/slices/formSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Asset } from "../../objects/types";

interface FormState extends Omit<Asset, "id"> {
  content: string;
}

const initialState: FormState = {
  title: "",
  description: "",
  owner: "",
  ownerTitle: "",
  createdDate: "",
  content: "",
  sharedWith: [],
  history: [],
};

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setOwner: (state, action: PayloadAction<string>) => {
      state.owner = action.payload;
    },
    setCreatedDate: (state, action: PayloadAction<string>) => {
      state.createdDate = action.payload;
    },
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    setSharedWith: (state, action: PayloadAction<string[]>) => {
      state.sharedWith = action.payload;
    },
    resetForm: () => initialState,
  },
});

export const {
  setTitle,
  setDescription,
  setOwner,
  setCreatedDate,
  setContent,
  setSharedWith,
  resetForm,
} = formSlice.actions;

export default formSlice.reducer;
