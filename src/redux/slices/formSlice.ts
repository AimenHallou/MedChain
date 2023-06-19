// src/redux/slices/formSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Asset, FileData } from "../../objects/types";

interface FormState extends Omit<Asset, "id"> {
  base64Content: FileData[] | null; 
}

const initialState: FormState = {
  title: "",
  description: "",
  owner: "",
  ownerTitle: "",
  createdDate: "",
  content: null,
  base64Content: null,
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
    setContent: (state, action: PayloadAction<FileData[] | null>) => {  // FileData used here
      state.content = action.payload;
    },
    setBase64Content: (state, action: PayloadAction<FileData[] | null>) => {  // FileData used here
      state.base64Content = action.payload;
    },
    setSharedWith: (state, action: PayloadAction<string[]>) => {
      state.sharedWith = action.payload;
    },
    setFormContent: (state, action: PayloadAction<FileData[]>) => {
      state.content = action.payload;
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
  setBase64Content,
  setFormContent,
} = formSlice.actions;

export default formSlice.reducer;
