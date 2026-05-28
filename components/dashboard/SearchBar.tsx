"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  return (
    <div className="relative max-w-md">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-950/30" />

      <input
        type="text"
        placeholder="Search articles..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full bg-white border border-emerald-950/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-950/10 transition-all"
      />
    </div>
  );
}
