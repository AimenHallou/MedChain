// src/pages/account.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import UserAccount from '../components/UserAccount';

export default function AccountPage() {
  // You would fetch the user data from your backend here
  const userData = {
    username: 'John Doe',
    email: 'john.doe@example.com',
    // Add other user data here
  };

  return (
    <Provider store={store}>
      <UserAccount {...userData} />
    </Provider>
  );
}
