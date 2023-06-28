// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UsersState, UserNotification, User } from "../../objects/types";
import { RootState } from '../store';

const initialState: UsersState = {
  users: [],
  currentUserAddress: null
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      const newUser = {
        ...action.payload,
      };
      state.users.push(newUser);
    },    
    setCurrentUser: (state, action: PayloadAction<string>) => {
      state.currentUserAddress = action.payload;
    },
    addNotification: (state, action: PayloadAction<{ address: string, notification: UserNotification }>) => {
      const user = state.users.find(user => user.address === action.payload.address);
      if (user) {
        user.notifications.push({
          ...action.payload.notification,
          patient_id: action.payload.notification.patient_id
        });
      }
    },
    removeNotification: (state, action: PayloadAction<{ address: string, notificationId: string }>) => {
      const user = state.users.find(user => user.address === action.payload.address);
      if (user) {
        user.notifications = user.notifications.filter(
          (notification) => notification.id !== action.payload.notificationId
        );
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<{ address: string, notificationId: string }>) => {
      const user = state.users.find(user => user.address === action.payload.address);
      if (user) {
        const notification = user.notifications.find((notification) => notification.id === action.payload.notificationId);
        if (notification) {
          notification.read = true;
        }
      }
    },
  },
});

export const { addUser, setCurrentUser, addNotification, removeNotification, markNotificationAsRead } = userSlice.actions;

export default userSlice.reducer;
