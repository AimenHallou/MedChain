// src/components/UserAccount.tsx
import React, { FC } from 'react';

interface UserAccountProps {
  username: string;
  email: string;
  // Add any other user properties you need
}

const UserAccount: FC<UserAccountProps> = ({ username, email }) => {
  return (
    <div>
      <h2>{username}</h2>
      <p>{email}</p>
      {/* Display other user information here */}
    </div>
  );
}

export default UserAccount;
