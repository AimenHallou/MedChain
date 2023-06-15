// src/redux/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState, UserNotification } from '../../objects/types'

const initialState: UserState = {
  address: '',
  title: '',
  notifications: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    addNotification: (state, action: PayloadAction<UserNotification>) => {
      state.notifications.push(action.payload);
    },
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
    },
  },
});

export const { setAddress, addNotification, removeNotification, setTitle } = userSlice.actions;

export default userSlice.reducer;