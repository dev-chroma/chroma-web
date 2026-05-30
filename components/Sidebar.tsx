"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { TrendingUp, Plus, ChevronRight } from "lucide-react";

import type { PublicArticle } from "@/types/article";

interface SidebarProps {
  trendingArticles: PublicArticle[];
}

const Sidebar: React.FC<SidebarProps> = ({ trendingArticles }) => {
  const router = useRouter();

  const categories = [
    "Poetry",
    "Short Story",
    "Essays",
    "Literary Criticism",
    "Art Gallery",
  ];

  return (
    <aside className="space-y-12">
      {/* TRENDING */}

      <section className="bg-white p-10 rounded-[2.5rem] border border-emerald-950/5 shadow-2xl shadow-emerald-950/5 relative overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-emerald-950/5 rounded-full flex items-center justify-center text-emerald-950">
            <TrendingUp className="w-5 h-5" />
          </div>

          <h2 className="text-xs font-bold text-emerald-950 uppercase tracking-[0.2em]">
            Trending Now
          </h2>
        </div>

        <div className="space-y-8">
          {trendingArticles.map((article, index) => (
            <Link
              key={article._id}
              href={`/article/${article._id}`}
              className="group cursor-pointer flex gap-5 items-start"
            >
              <span className="text-4xl font-serif font-bold text-emerald-950/10 group-hover:text-emerald-950/20 transition-colors leading-none pt-1">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3 className="font-serif font-bold text-emerald-950 group-hover:text-emerald-800 transition-colors leading-snug mb-2 line-clamp-2">
                  {article.title}
                </h3>

                <div className="flex items-center gap-2 text-[10px] text-emerald-950/40 uppercase tracking-widest font-bold">
                  <span>
                    {article.author.firstName} {article.author.surname}
                  </span>

                  <span className="text-[8px]">•</span>

                  <span>{article.readTime} read</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}

      <section className="bg-emerald-950 p-8 rounded-[2.5rem] text-cream-50 overflow-hidden relative group shadow-2xl shadow-emerald-950/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />

        <h2 className="text-xl font-serif font-bold mb-8 relative z-10">
          Creative Realms
        </h2>

        <ul className="space-y-5 relative z-10">
          {categories.map((cat) => (
            <li key={cat}>
              <button
                onClick={() =>
                  router.push(`/?category=${encodeURIComponent(cat)}`)
                }
                className="flex items-center justify-between w-full text-sm font-medium hover:text-white transition-colors group/item"
              >
                <span className="text-cream-50/60 group-hover/item:text-white group-hover/item:translate-x-1 transition-all duration-300">
                  {cat}
                </span>

                <ChevronRight className="w-4 h-4 text-cream-50/20 group-hover/item:text-white transition-all transform group-hover/item:translate-x-1" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}

      <section className="bg-white p-10 rounded-[2.5rem] border border-emerald-950/5 shadow-2xl shadow-emerald-950/5 relative overflow-hidden flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-emerald-950 text-cream-50 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-950/20 transform rotate-3 hover:rotate-0 transition-transform duration-700">
          <Plus className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-serif font-bold text-emerald-950 mb-4">
          Share Your Story
        </h3>

        <p className="text-emerald-950/60 text-sm mb-8 leading-relaxed font-medium">
          Join our community of young creative writers. Publish your first piece
          today.
        </p>

        <Link
          href="/submit-piece"
          className="w-full py-4.5 bg-emerald-950 text-cream-50 flex items-center justify-center rounded-full font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all active:scale-95 shadow-lg shadow-emerald-950/10 mb-4"
        >
          SUBMIT WORK
        </Link>

        <Link
          href="/submit"
          className="text-[10px] text-emerald-950/40 uppercase tracking-widest font-bold hover:text-emerald-950 transition-colors"
        >
          Guidelines & Rules
        </Link>
      </section>
    </aside>
  );
};

export default Sidebar;
