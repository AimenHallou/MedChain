// src/components/Header.tsx
import React, { FC } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import NotificationDropdown from "./NotificationDropdown";

const Header: FC = () => {
  const { users, currentUserAddress } = useSelector(
    (state: RootState) => state.user
  );

  const currentUser = users.find((user) => user.address === currentUserAddress);

  return (
    <header className="flex justify-between px-4 py-2 bg-blue-header text-white">
      <nav className="flex">
        <Link href="/">
          <img src="/images/logo.png" alt="Logo" className="h-12 mr-3" />
        </Link>
      </nav>
      <div className="flex gap-4">
        <span className="relative inline-block cursor-pointer">
          <NotificationDropdown />
        </span>
        <Link href="/account">
          <button className="px-6 py-3 bg-blue-button text-white rounded cursor-pointer">
            {currentUser
              ? `${currentUser.address.substring(0, 20)}...`
              : "Account"}
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
