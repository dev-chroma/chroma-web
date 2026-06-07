"use client";

import { useEffect, useState } from "react";
import { Send, Trash2 } from "lucide-react";

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  readBy?: string[];
}

export default function AdminNotificationManager() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications", {
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();

      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      return;
    }

    try {
      setLoading(true);

      await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          message,
          isGlobal: true,
        }),
      });

      setTitle("");
      setMessage("");

      await fetchNotifications();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      });

      await fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-[3rem] shadow-xl border border-emerald-950/5 overflow-hidden">
        <div className="p-10 border-b border-emerald-950/5">
          <h2 className="text-3xl font-serif font-bold text-emerald-950">
            Notification Center
          </h2>
        </div>

        <div className="p-10 space-y-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification Title"
            className="w-full rounded-2xl border border-emerald-950/10 px-5 py-4"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Notification Message"
            rows={5}
            className="w-full rounded-2xl border border-emerald-950/10 px-5 py-4"
          />

          <button
            onClick={sendNotification}
            disabled={loading}
            className="px-8 py-4 rounded-2xl bg-emerald-950 text-white flex items-center gap-3 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />

            {loading ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl mt-6 border border-emerald-950/5 overflow-hidden">
        <div className="p-10 border-b border-emerald-950/5">
          <h2 className="text-3xl font-serif font-bold text-emerald-950">
            Recent Notifications
          </h2>
        </div>

        {notifications.map((notification) => (
          <div
            key={notification._id}
            className="p-6 border-b border-emerald-950/5 flex justify-between items-center"
          >
            <div>
              <h4 className="font-bold">{notification.title}</h4>

              <p className="text-sm text-emerald-950/60">
                {notification.message}
              </p>
            </div>

            <button
              onClick={() => deleteNotification(notification._id)}
              className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
