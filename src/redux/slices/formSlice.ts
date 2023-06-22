// src/redux/slices/formSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Patient, FileData } from "../../objects/types";

interface FormState extends Omit<Patient, "id"> {
  base64Content: FileData[] | null; 
}

const initialState: FormState = {
  patient_id: "",
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
    setPatient_id: (state, action: PayloadAction<string>) => {
      state.patient_id = action.payload;
    },
    setOwner: (state, action: PayloadAction<string>) => {
      state.owner = action.payload;
    },
    setCreatedDate: (state, action: PayloadAction<string>) => {
      state.createdDate = action.payload;
    },
    setContent: (state, action: PayloadAction<FileData[] | null>) => {
      state.content = action.payload;
    },
    setBase64Content: (state, action: PayloadAction<FileData[] | null>) => {
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
  setPatient_id,
  setOwner,
  setCreatedDate,
  setContent,
  setSharedWith,
  resetForm,
  setBase64Content,
  setFormContent,
} = formSlice.actions;

export default formSlice.reducer;
