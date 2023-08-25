// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { UsersState, UserNotification, User } from "../../objects/types";

const initialState: UsersState = {
  users: [],
  currentUserAddress: null,
};

// Async thunk for fetching all users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("/api/users");
  const users = await response.json();
  users.forEach(user => {
    user.notifications = JSON.parse(user.notifications);
  });
  return users;
});

// Async thunk for adding a new user
export const createUser = createAsyncThunk(
  "users/createUser",
  async (user: User) => {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    const userData = await response.json();
    return userData;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<string | null>) => {
      state.currentUserAddress = action.payload;
    },    
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    addNotification: (
      state,
      action: PayloadAction<{ address: string; notification: UserNotification }>
    ) => {
      const user = state.users.find(
        (user) => user.address === action.payload.address
      );
      if (user) {
        user.notifications.push({
          ...action.payload.notification,
          patient_id: action.payload.notification.patient_id,
          accepted: action.payload.notification.accepted || false,
          rejected: action.payload.notification.rejected || false,
        });
      }
    },
    removeNotification: (
      state,
      action: PayloadAction<{ address: string; notificationId: string }>
    ) => {
      const user = state.users.find(
        (user) => user.address === action.payload.address
      );
      if (user) {
        user.notifications = user.notifications.filter(
          (notification) => notification.id !== action.payload.notificationId
        );
      }
    },
    markNotificationAsRead: (
      state,
      action: PayloadAction<{ address: string; notificationId: string }>
    ) => {
      const user = state.users.find(
        (user) => user.address === action.payload.address
      );
      if (user) {
        const notification = user.notifications.find(
          (notification) => notification.id === action.payload.notificationId
        );
        if (notification) {
          notification.read = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
        console.log("State after user has been added:", state);
      });
  },
});

export const {
  setCurrentUser,
  addUser,
  addNotification,
  removeNotification,
  markNotificationAsRead,
} = userSlice.actions;

export default userSlice.reducer;
