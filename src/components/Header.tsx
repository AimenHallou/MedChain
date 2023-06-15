import React, { FC } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import SearchBar from "./SearchBar";
import NotificationDropdown from "./NotificationDropdown";

const Header: FC = () => {
  const { users, currentUserAddress } = useSelector(
    (state: RootState) => state.user
  );
  const currentUser = users.find((user) => user.address === currentUserAddress);

  const notifications = currentUser?.notifications;
  
  const unreadNotifications = notifications?.filter(
    (notification) => !notification.read
  ) || [];


  return (
    <header className="flex justify-between px-4 py-2 bg-blue-900 text-white items-center">
      <nav className="flex gap-4">
        <Link href="/">
          <span className="text-3xl font-bold text-white cursor-pointer">
            MedChain
          </span>
        </Link>
        <Link href="/publish">
          <span className="text-lg text-white cursor-pointer">
            Publish Data
          </span>
        </Link>
        <Link href="/account">
          <span className="text-lg text-white cursor-pointer">Account</span>
        </Link>
      </nav>
      <div className="flex gap-4">
        <SearchBar />
        <div>
          <span className="relative inline-block cursor-pointer">
            <NotificationDropdown />
          </span>
        </div>
        <button className="px-4 py-2 bg-blue-700 text-white rounded">
          Connect Wallet
        </button>
      </div>
    </header>
  );
};

export default Header;
