// src/components/Header.tsx
import React, { FC } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import SearchBar from "./SearchBar";
import NotificationDropdown from "./NotificationDropdown";

interface HeaderProps {
  onSearch: (term: string) => void;
}

const Header: FC<HeaderProps> = ({ onSearch }) => {
  const { users, currentUserAddress } = useSelector(
    (state: RootState) => state.user
  );

  const currentUser = users.find((user) => user.address === currentUserAddress);

  const notifications = currentUser?.notifications;

  const unreadNotifications =
    notifications?.filter((notification) => !notification.read) || [];

  return (
    <header className="flex justify-between px-4 py-2 bg-blue-900 text-white items-center ">
      <nav className="flex gap-4">
        <Link href="/">
          <img src="/images/logo.png" alt="Logo" className="h-12 mr-3" />
        </Link>
      </nav>
      <div className="flex gap-4">
        <SearchBar onSearch={onSearch} />
        <div>
          <span className="relative inline-block cursor-pointer">
            <NotificationDropdown />
          </span>
        </div>
        <Link href="/account">
          <button className="px-6 py-3 bg-blue-700 text-white rounded cursor-pointer">
            {currentUser ? currentUser.address : "Account"}
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
