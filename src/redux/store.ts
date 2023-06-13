// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import formReducer from './slices/formSlice';
import assetsReducer from './slices/assetSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    form: formReducer,
    assets: assetsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
