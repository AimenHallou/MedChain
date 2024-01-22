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
  return users.map((user) => ({
    ...user,
    notifications: JSON.parse(user.notifications || "[]"),
  }));
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
    return await response.json();
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (user: User) => {
    const response = await fetch(`/api/users/${user.address}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    const updatedUser = await response.json();
    return updatedUser;
  }
);

// Async thunk for reading notifications
export const readNotifications = createAsyncThunk(
  "users/readNotifications",
  async (payload: { address: string }) => {
    const response = await fetch(
      `/api/users/${payload.address}/readNotifications`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to read notifications");
    }
    return { address: payload.address, notifications: await response.json() };
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (address: string) => {
    const response = await fetch(`/api/users/${address}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
    return address;
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
        (u) => u.address === action.payload.address
      );
      if (user) {
        user.notifications.push(action.payload.notification);
      }
    },
    removeNotification: (
      state,
      action: PayloadAction<{ address: string; notificationId: string }>
    ) => {
      const user = state.users.find(
        (u) => u.address === action.payload.address
      );
      if (user) {
        user.notifications = user.notifications.filter(
          (notif) => notif.id !== action.payload.notificationId
        );
      }
    },
    markNotificationAsRead: (
      state,
      action: PayloadAction<{ address: string; notificationId: string }>
    ) => {
      const user = state.users.find(
        (u) => u.address === action.payload.address
      );
      if (user) {
        const notification = user.notifications.find(
          (notif) => notif.id === action.payload.notificationId
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
      })
      .addCase(readNotifications.fulfilled, (state, action) => {
        const user = state.users.find(
          (u) => u.address === action.payload.address
        );
        if (user) {
          user.notifications = action.payload.notifications;
        }
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (u) => u.address === action.payload.address
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(
          (user) => user.address !== action.payload
        );
        if (state.currentUserAddress === action.payload) {
          state.currentUserAddress = null;
        }
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
