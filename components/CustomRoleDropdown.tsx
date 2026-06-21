"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { UserRole } from "@/types/user";

interface Props {
  value: UserRole;
  onChange: (role: Exclude<UserRole, "Owner">) => void;
  canAssignAdmin?: boolean;
  disabled?: boolean;
  openUp?: boolean;
}

const roleStyles = {
  Owner: {
    button: "bg-amber-100 text-amber-700",
    active: "bg-amber-50 text-amber-700",
  },
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
  canAssignAdmin = false,
  disabled = false,
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

  const roles: Exclude<UserRole, "Owner">[] = [
    ...(canAssignAdmin ? (["Admin"] as const) : []),
    "Editor",
    "Author",
  ];

  return (
    <div className="relative w-40" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        className={`w-full flex items-center justify-center cursor-pointer gap-2 px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-[0.15em] transition-all ${roleStyles[value].button}`}
      >
        {value}

        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && !disabled && (
        <div
          className={`absolute left-0 w-full rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-[9999]
              ${openUp ? "bottom-full mb-2" : "top-full mt-2"}`}
        >
          {roles.map((role) => (
            <button
              type="button"
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
