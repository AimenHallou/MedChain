// src/components/NotificationDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { removeNotification, markNotificationAsRead } from "../redux/slices/userSlice";

const NotificationDropdown: React.FC = () => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  
  const { users, currentUserAddress } = useSelector(
    (state: RootState) => state.user
  );
  const currentUser = users.find((user) => user.address === currentUserAddress);
  const notifications = currentUser?.notifications;
  const unreadNotifications =
    notifications?.filter((notification) => !notification.read) || [];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    markAllNotificationsAsRead();
  };
  
  const markAllNotificationsAsRead = () => {
    notifications?.forEach(notification => {
      if (!notification.read) {
        dispatch(markNotificationAsRead({address: currentUserAddress as string, notificationId: notification.id}));
      }
    });
  };

  const handleCloseNotification = (id: string) => {
    dispatch(removeNotification({address: currentUserAddress as string, notificationId: id}));
  };

  const ref = useRef(null);
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="relative" ref={ref}>
      <button onClick={toggleDropdown}>
        <img src="/images/bell.png" alt="Notification" className="h-12 w-12" />
        {unreadNotifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 w-64 mt-2 py-2 bg-white border rounded shadow-xl z-50">
          {notifications?.map((notification) => (
            <div
              className="px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white"
              key={notification.id}
            >
              <p>{notification.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
