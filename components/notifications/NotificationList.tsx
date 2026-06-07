"use client";

import { useMemo, useState } from "react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  readBy: string[];
}

interface Props {
  notifications: Notification[];
  userId: string;
}

export default function NotificationList({ notifications, userId }: Props) {
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const isRead = notification.readBy?.some(
        (id) => id.toString() === userId,
      );

      if (filter === "all") return true;

      if (filter === "read") {
        return isRead;
      }

      return !isRead;
    });
  }, [notifications, filter, userId]);

  return (
    <div className="bg-white rounded-[3rem] border border-emerald-950/5 shadow-xl overflow-hidden">
      <div className="p-8 border-b border-emerald-950/5 flex gap-4">
        {["all", "unread", "read"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab as "all" | "read" | "unread")}
            className={`px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              filter === tab
                ? "bg-emerald-950 text-white"
                : "bg-emerald-950/5 text-emerald-950"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="p-20 text-center text-emerald-950/40">
          No notifications found
        </div>
      )}

      {filteredNotifications.map((notification) => {
        const isRead = notification.readBy?.some(
          (id) => id.toString() === userId,
        );

        return (
          <div
            key={notification._id}
            className={`p-8 border-b border-emerald-950/5 ${
              !isRead ? "bg-emerald-50 border-l-4 border-emerald-600" : ""
            }`}
          >
            <h3 className="font-bold text-lg text-emerald-950">
              {notification.title}
            </h3>

            <p className="mt-2 text-emerald-950/70">{notification.message}</p>

            <p className="mt-3 text-xs text-emerald-950/30">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        );
      })}
    </div>
  );
}
