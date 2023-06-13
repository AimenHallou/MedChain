// src/pages/account.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import UserAccount from '../components/UserAccount';

export default function AccountPage() {
  const userData = {
    username: 'John Doe',
    email: 'john.doe@example.com',
  };

  return (
    <Provider store={store}>
      <UserAccount/>
    </Provider>
  );
}
