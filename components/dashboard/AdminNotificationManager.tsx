"use client";

import { useEffect, useState } from "react";
import { Send, Trash2, Search } from "lucide-react";
import Image from "next/image";

import { api } from "@/services/api";
import type { PublicUser } from "@/types/user";

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  readBy?: string[];
  isGlobal?: boolean;
  recipients?: string[];
}

export default function AdminNotificationManager() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [users, setUsers] = useState<PublicUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGlobal, setIsGlobal] = useState(true);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

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

  const fetchUsers = async () => {
    try {
      const data = await api.users.listAll();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications();
    fetchUsers();

    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      return;
    }

    if (!isGlobal && selectedRecipients.length === 0) {
      alert("Please select at least one recipient.");
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
          isGlobal,
          recipients: isGlobal ? [] : selectedRecipients,
        }),
      });

      setTitle("");
      setMessage("");
      setSelectedRecipients([]);

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

  const filteredUsers = users.filter((u) => {
    const fullName = `${u.firstName} ${u.surname}`.toLowerCase();
    const email = u.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <>
      <div className="bg-white rounded-[3rem] shadow-2xl border border-emerald-950/5 overflow-hidden">
        <div className="p-10 border-b border-emerald-950/5">
          <h2 className="text-2xl font-serif font-bold text-emerald-950">
            Notification Center
          </h2>
        </div>

        <div className="p-10 space-y-6">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Notification Title"
            className="w-full bg-emerald-950/5 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-emerald-950/10 transition-all placeholder:text-emerald-950/20 text-sm font-medium"
          />

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Notification Message"
            rows={5}
            className="w-full bg-emerald-950/5 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-emerald-950/10 transition-all placeholder:text-emerald-950/20 text-sm font-medium resize-none"
          />

          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-[0.2em] text-emerald-950/50">
              Recipients
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => setIsGlobal(true)}
                className={`flex-1 py-4.5 px-6 rounded-2xl font-bold text-[10px] tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer border ${isGlobal
                    ? "bg-emerald-950 text-cream-50 border-emerald-950 shadow-xl shadow-emerald-950/20"
                    : "bg-emerald-950/5 text-emerald-950/60 border-transparent hover:bg-emerald-950/10"
                  }`}
              >
                All Users (Global)
              </button>
              <button
                type="button"
                onClick={() => setIsGlobal(false)}
                className={`flex-1 py-4.5 px-6 rounded-2xl font-bold text-[10px] tracking-[0.2em] uppercase transition-all duration-300 cursor-pointer border ${!isGlobal
                    ? "bg-emerald-950 text-cream-50 border-emerald-950 shadow-xl shadow-emerald-950/20"
                    : "bg-emerald-950/5 text-emerald-950/60 border-transparent hover:bg-emerald-950/10"
                  }`}
              >
                Specific Users
              </button>
            </div>
          </div>

          {!isGlobal && (
            <div className="space-y-6 border border-emerald-950/5 rounded-[2rem] p-8 bg-emerald-950/2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-emerald-950/20" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white rounded-2xl border border-emerald-950/5 pl-12 pr-6 py-4 outline-none focus:ring-2 focus:ring-emerald-950/10 transition-all text-sm font-medium"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRecipients(users.map((u) => u._id))}
                    className="px-4 py-2.5 rounded-xl border border-emerald-950/5 bg-white hover:bg-emerald-950/10 text-[10px] font-bold tracking-[0.1em] uppercase text-emerald-950 cursor-pointer transition-all"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRecipients([])}
                    className="px-4 py-2.5 rounded-xl border border-emerald-950/5 bg-white hover:bg-red-50 text-[10px] font-bold tracking-[0.1em] uppercase text-red-600 cursor-pointer transition-all"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-emerald-950/5 bg-white border border-emerald-950/5 rounded-2xl shadow-inner">
                {filteredUsers.length === 0 ? (
                  <div className="p-8 text-center text-sm text-emerald-950/40 font-medium">
                    No users found
                  </div>
                ) : (
                  filteredUsers.map((u) => {
                    const isSelected = selectedRecipients.includes(u._id);
                    return (
                      <label
                        key={u._id}
                        className="flex items-center gap-5 px-6 py-4 hover:bg-emerald-700/5 cursor-pointer transition-all duration-200 select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            if (isSelected) {
                              setSelectedRecipients((prev) =>
                                prev.filter((id) => id !== u._id)
                              );
                            } else {
                              setSelectedRecipients((prev) => [...prev, u._id]);
                            }
                          }}
                          className="w-4 h-4 rounded text-emerald-950 border-emerald-950/10 focus:ring-emerald-950/20 cursor-pointer"
                        />
                        {u.avatar ? (
                          <Image
                            src={u.avatar}
                            alt={u.firstName}
                            width={36}
                            height={36}
                            className="w-9 h-9 rounded-full object-cover border border-emerald-950/10"
                            unoptimized
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-emerald-950 text-white flex items-center justify-center font-bold text-xs border border-emerald-950/10">
                            {u.firstName[0]}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-emerald-950 truncate">
                            {u.firstName} {u.surname}
                          </p>
                          <p className="text-xs text-emerald-950/40 truncate">
                            {u.email}
                          </p>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-950/50 bg-emerald-950/5 px-2.5 py-1.5 rounded-lg border border-emerald-950/5">
                          {u.role}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>

              <div className="text-xs text-emerald-950/50 font-bold uppercase tracking-wider pl-2">
                {selectedRecipients.length} user{selectedRecipients.length !== 1 ? "s" : ""} selected for notification
              </div>
            </div>
          )}

          <button
            onClick={sendNotification}
            disabled={loading}
            className="px-10 py-5 bg-emerald-950 text-cream-50 rounded-2xl cursor-pointer font-bold text-[10px] tracking-[0.2em] uppercase hover:bg-emerald-900 transition-all shadow-xl shadow-emerald-950/20 flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95 w-fit"
          >
            <Send className="w-4 h-4" />

            {loading ? "Sending..." : "Send Notification"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-2xl mt-6 border border-emerald-950/5 overflow-hidden">
        <div className="p-10 border-b border-emerald-950/5">
          <h2 className="text-3xl font-serif font-bold text-emerald-950">
            Recent Notifications
          </h2>
        </div>

        {notifications.map((notification) => (
          <div
            key={notification._id}
            className="px-10 py-8 border-b border-emerald-950/5 flex justify-between items-center group hover:bg-emerald-700/5 transition-colors"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h4 className="text-lg font-serif font-bold text-emerald-950">{notification.title}</h4>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${notification.isGlobal ?? true
                    ? "bg-emerald-950/5 text-emerald-950/60 border-emerald-950/5"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                  }`}>
                  {notification.isGlobal ?? true
                    ? "Global"
                    : `Targeted (${notification.recipients?.length || 0})`}
                </span>
              </div>

              <p className="text-sm text-emerald-950/60 font-medium">
                {notification.message}
              </p>
            </div>

            <button
              onClick={() => deleteNotification(notification._id)}
              className="p-3.5 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
