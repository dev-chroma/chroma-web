"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  readBy?: string[];
}

interface Props {
  userId: string;
  notifications: Notification[];
}

export default function NotificationBell({
  userId,
  notifications: initialNotifications,
}: Props) {
  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState(initialNotifications);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const refreshNotifications = async () => {
    const res = await fetch("/api/notifications", {
      cache: "no-store",
    });

    const data = await res.json();

    setNotifications(data);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(
    (notification) =>
      !notification.readBy?.some((id) => id.toString() === userId),
  ).length;

  return (
    <div ref={wrapperRef} className="relative overflow-visible">
      <button
        onClick={async () => {
          await refreshNotifications();
          setOpen((prev) => !prev);
        }}
        className="relative flex items-center justify-center p-2.5 rounded-full hover:bg-emerald-950/5 transition-colors"
      >
        <Bell className="w-5 h-5 text-emerald-950 hover:text-emerald-800 cursor-pointer" />
        {unreadCount > 0 && (
          <span className="absolute top-0 -right-1 w-4 h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-md">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          userId={userId}
          close={() => setOpen(false)}
          refreshNotifications={refreshNotifications}
        />
      )}
    </div>
  );
}
