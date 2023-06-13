// src/components/UserAccount.tsx
import React, { FC, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUsername, setEmail } from '../redux/slices/userSlice';
import { RootState } from '../redux/store';

const UserAccount: FC = () => {
  const dispatch = useDispatch();
  const { username, email } = useSelector((state: RootState) => state.user);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setUsername(event.target.value));
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(event.target.value));
  };

  return (
    <div>
      <h2>{username}</h2>
      <input type="text" value={username} onChange={handleUsernameChange} />

      <p>{email}</p>
      <input type="text" value={email} onChange={handleEmailChange} />
    </div>
  );
}

export default UserAccount;
