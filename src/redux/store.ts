// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./slices/formSlice";
import patientsReducer from "./slices/patientSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    form: formReducer,
    patients: patientsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
