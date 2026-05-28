"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function AdminArticleSearch() {
  const router = useRouter();

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-950/30" />

      <input
        type="text"
        placeholder="Search all pieces..."
        onChange={(e) => router.push(`?search=${e.target.value}`)}
        className="bg-emerald-950/5 border-none rounded-xl py-3 pl-12 pr-6 text-sm font-medium w-64 outline-none focus:ring-2 focus:ring-emerald-950/10 transition-all"
      />
    </div>
  );
}
