"use client";

import Link from "next/link";
import { CheckCheck } from "lucide-react";
import { useEffect, useRef } from "react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  readBy?: string[];
}

interface Props {
  notifications: Notification[];
  userId: string;
  close: () => void;
  refreshNotifications: () => Promise<void>;
}

export default function NotificationDropdown({
  notifications,
  userId,
  close,
  refreshNotifications,
}: Props) {
  const markAllRead = async () => {
    try {
      await fetch("/api/notifications/read-all", {
        method: "PATCH",
      });

      await refreshNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const markRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
      });

      await refreshNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  const unreadNotifications = notifications.filter(
    (notification) => !notification.readBy?.includes(userId),
  );

  return (
    <div className="absolute top-full mt-4 right-0 w-[550px] bg-white translate-x-[35%] rounded-3xl border border-emerald-950/5 shadow-2xl overflow-hidden z-[9999]">
      <div className="p-6 border-b border-emerald-950/5 flex gap-12 items-center justify-between">
        <h3 className="font-bold text-lg text-emerald-950">Notifications</h3>

        <button
          onClick={markAllRead}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-950"
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-112.5 overflow-y-auto">
        {unreadNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-950/5 flex items-center justify-center mb-4">
              <CheckCheck className="w-8 h-8 text-emerald-950/30" />
            </div>

            <h4 className="text-lg font-bold text-emerald-950">
              You&apos;re all caught up
            </h4>

            <p className="mt-2 text-sm text-emerald-950/50 max-w-xs">
              There are no unread notifications right now.
            </p>

            <Link
              href="/notifications"
              onClick={close}
              className="mt-6 px-5 py-3 rounded-xl bg-emerald-950 text-white text-sm font-medium hover:bg-emerald-900 transition-all"
            >
              View All Notifications
            </Link>
          </div>
        ) : (
          unreadNotifications.slice(0, 4).map((notification) => (
            <button
              key={notification._id}
              onClick={() => markRead(notification._id)}
              className="w-full text-left p-5 border-b border-emerald-950/5 bg-emerald-50 border-l-4 transition-all hover:bg-emerald-100/50"
            >
              <div>
                <h4 className="font-semibold text-emerald-950">
                  {notification.title}
                </h4>

                <p className="mt-1 text-sm text-emerald-950/60">
                  {notification.message}
                </p>

                <p className="mt-2 text-xs text-emerald-950/30">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {unreadNotifications.length !== 0 && (
        <div className="p-4 border-t border-emerald-950/5">
          <Link
            href="/notifications"
            onClick={close}
            className="block text-center py-3 rounded-xl bg-emerald-950 text-white font-medium hover:bg-emerald-900 transition-all"
          >
            View All Notifications
          </Link>
        </div>
      )}
    </div>
  );
}
