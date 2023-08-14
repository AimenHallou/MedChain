// src/components/account/NotLoggedInView.tsx

import React from 'react';

type NotLoggedInViewProps = {
  handleLogin: () => void;
};

const NotLoggedInView: React.FC<NotLoggedInViewProps> = ({ handleLogin }) => (
  <div className="flex flex-col items-center justify-center h-full">
    <h2 className="text-3xl font-bold mb-2">User Account</h2>
    <p className="text-lg mb-12 text-gray-300">
      Please log in to access your account details.
    </p>
    <button
      onClick={handleLogin}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
    >
      Login with MetaMask
    </button>
  </div>
);

export default NotLoggedInView;
