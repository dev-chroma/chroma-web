"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

type UserRole = "Author" | "Editor" | "Admin";

interface Props {
  value: UserRole;
  onChange: (role: UserRole) => void;
  openUp?: boolean;
}

const roleStyles = {
  Admin: {
    button: "bg-purple-100 text-purple-700",
    active: "bg-purple-50 text-purple-700",
  },
  Editor: {
    button: "bg-blue-100 text-blue-700",
    active: "bg-blue-50 text-blue-700",
  },
  Author: {
    button: "bg-emerald-100 text-emerald-700",
    active: "bg-emerald-50 text-emerald-700",
  },
};

export default function CustomRoleDropdown({
  value,
  onChange,
  openUp = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const roles: UserRole[] = ["Admin", "Editor", "Author"];

  return (
    <div className="relative w-40" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-center cursor-pointer gap-2 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-[0.15em] transition-all ${roleStyles[value].button}`}
      >
        {value}

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className={`absolute left-0 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-[9999]
              ${openUp ? "bottom-full mb-2" : "top-full mt-2"}`}
        >
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => {
                onChange(role);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between cursor-pointer px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                value === role
                  ? roleStyles[role].active
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {role}

              {value === role && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
