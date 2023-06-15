import React, { FC } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import SearchBar from './SearchBar';

const Header: FC = () => {
  const notifications = useSelector((state: RootState) => state.user.notifications);
  const unreadNotifications = notifications.filter(notification => !notification.read);

  return (
    <header className="flex justify-between px-4 py-2 bg-blue-900 text-white items-center">
      <nav className="flex gap-4">
        <Link href="/">
          <span className="text-3xl font-bold text-white cursor-pointer">MedChain</span>
        </Link>
        <Link href="/publish">
          <span className="text-lg text-white cursor-pointer">Publish Data</span>
        </Link>
        <Link href="/account">
          <span className="text-lg text-white cursor-pointer">Account</span>
        </Link>
      </nav>
      <div className="flex gap-4">
        <SearchBar />
        <div>
          <span className="relative inline-block cursor-pointer">
            <img src="/images/bell.png" alt="Notification" className="h-10 w-10" />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-ping"></span>
            )}
          </span>
        </div>
        <button className="px-4 py-2 bg-blue-700 text-white rounded">
          Connect Wallet
        </button>
      </div>
    </header>
  );
}

export default Header;
