import React, { FC, ChangeEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUsername, setEmail } from '../redux/slices/userSlice';
import { RootState } from '../redux/store';
import PublishedAssets from '../components/PublishedAssets';
import AccessedAssets from '../components/AccessedAssets';

const UserAccount: FC = () => {
  const dispatch = useDispatch();
  const { username, email } = useSelector((state: RootState) => state.user);

  const [showSection, setShowSection] = useState('published');

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setUsername(event.target.value));
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(event.target.value));
  };

  return (
    <div className="bg-gray-900 p-6 rounded shadow-lg max-w-lg mx-auto mt-10 text-white">
      <h2 className="text-2xl font-bold mb-2">{username}</h2>
      <input
        type="text"
        value={username}
        placeholder="Username"
        onChange={handleUsernameChange}
        className="block bg-gray-700 placeholder-white text-white border border-gray-600 rounded p-2 w-full mb-4"
      />

      <p className="text-gray-300 mb-2">{email}</p>
      <input
        type="text"
        value={email}
        placeholder="Email"
        onChange={handleEmailChange}
        className="block bg-gray-700 placeholder-white text-white border border-gray-600 rounded p-2 w-full mb-4"
      />

      <div className="flex justify-between mb-4">
        <button
          onClick={() => setShowSection('published')}
          className={`py-2 px-4 rounded ${showSection === 'published' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}
        >
          Published Assets
        </button>
        <button
          onClick={() => setShowSection('accessed')}
          className={`py-2 px-4 rounded ${showSection === 'accessed' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-white'}`}
        >
          Accessed Assets
        </button>
      </div>

      {showSection === 'published' && <PublishedAssets />}
      {showSection === 'accessed' && <AccessedAssets />}
    </div>
  );
};

export default UserAccount;
