"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import NotificationBell from "./notifications/NotificationBell";
import { logout } from "@/lib/logout";

import type { PublicUser } from "@/types/user";

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  readBy?: string[];
}

interface Props {
  user: PublicUser | null;
  notifications: Notification[];
}

export default function UserSection({ user, notifications }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) {
    return (
      <Link
        href="/auth"
        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-950 text-white rounded-full text-sm font-bold"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <NotificationBell userId={user._id} notifications={notifications} />

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 hover:bg-emerald-950/5 p-1.5 cursor-pointer px-2.5 rounded-full transition-colors focus:outline-none"
        >
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.firstName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border border-emerald-950/10 shadow-sm"
              unoptimized
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-emerald-950 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              {user.firstName[0]}
            </div>
          )}
          <ChevronDown
            className={`w-4 h-4 text-emerald-950/60 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-emerald-950/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              href={`/profile/${user._id}`}
              onClick={() => setDropdownOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-emerald-950/60 hover:text-emerald-950 hover:bg-emerald-950/5 transition-all"
            >
              Profile
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setDropdownOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-emerald-950/60 hover:text-emerald-950 hover:bg-emerald-950/5 transition-all"
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="w-full text-left block px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 transition-all focus:outline-none"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

