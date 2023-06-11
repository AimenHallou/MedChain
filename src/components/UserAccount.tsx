// src/components/UserAccount.tsx
import React, { FC } from 'react';

interface UserAccountProps {
  username: string;
  email: string;
}

const UserAccount: FC<UserAccountProps> = ({ username, email }) => {
  return (
    <div>
      <h2>{username}</h2>
      <p>{email}</p>
      {
        
      }
    </div>
  );
}

export default UserAccount;
