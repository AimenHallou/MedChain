import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = useSelector(
    (state: RootState) => state.user.notifications
  );
  const unreadNotifications = notifications.filter(
    (notification) => !notification.read
  );

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative">
      <button onClick={toggleDropdown}>
        <img src="/images/bell.png" alt="Notification" className="h-10 w-10" />
        {unreadNotifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-ping"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 w-64 mt-2 py-2 bg-white border rounded shadow-xl">
          {notifications.map((notification) => (
            <a
              href="#"
              className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
              key={notification.id}
            >
              {notification.message}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
