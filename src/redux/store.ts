// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./slices/formSlice";
import patientsReducer from "./slices/patientSlice";
import userReducer from "./slices/userSlice";
import datasetReducer from "./slices/datasetSlice";

export const store = configureStore({
  reducer: {
    form: formReducer,
    patients: patientsReducer,
    user: userReducer,
    datasets: datasetReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
