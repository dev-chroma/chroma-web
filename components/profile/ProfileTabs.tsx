"use client";

import { useState } from "react";
import { GraduationCap, Calendar } from "lucide-react";

import type { PublicUser } from "@/types/user";
import type { PublicArticle } from "@/types/article";

import ArticleCard from "@/components/ArticleCard";

interface ProfileTabsProps {
  profile: PublicUser;
  articles: PublicArticle[];
}

export default function ProfileTabs({ profile, articles }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"chronicles" | "about">(
    "chronicles",
  );

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-7xl mx-auto">
        {/* TABS */}

        <div className="flex justify-center md:justify-start items-center gap-12 mb-20 border-b border-emerald-950/5 pb-4">
          <button
            onClick={() => setActiveTab("chronicles")}
            className={`font-serif relative text-md font-bold tracking-wide transition-all ${
              activeTab === "chronicles"
                ? "text-emerald-950"
                : "text-emerald-950/30 hover:text-emerald-950/40"
            }`}
          >
            Published Chronicles
            {activeTab === "chronicles" && (
              <div className="absolute -bottom-5 left-0 right-0 h-1 bg-emerald-950 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`font-serif relative text-md font-bold tracking-wide transition-all ${
              activeTab === "about"
                ? "text-emerald-950"
                : "text-emerald-950/30 hover:text-emerald-950/40"
            }`}
          >
            Author&apos;s Path
            {activeTab === "about" && (
              <div className="absolute -bottom-5 left-0 right-0 h-1 bg-emerald-950 rounded-full" />
            )}
          </button>
        </div>

        {/* CONTENT */}

        {activeTab === "chronicles" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <div key={article._id} className="h-full">
                <ArticleCard article={article} />
              </div>
            ))}

            {articles.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-950/5 rounded-full flex items-center justify-center mx-auto text-emerald-950/20">
                  <GraduationCap className="w-10 h-10" />
                </div>

                <p className="text-[10px] font-bold text-emerald-950/40 uppercase tracking-[0.3em] italic">
                  The library is empty, for now.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-10 space-y-12">
            {/* BIO */}

            <div className="space-y-6">
              <h3 className="text-2xl font-serif font-bold text-emerald-950">
                Biography
              </h3>

              <p className="text-lg text-emerald-950/70 leading-relaxed font-medium">
                {profile.bio ||
                  "This author has chosen to keep their story shrouded in mystery, letting their works speak for themselves."}
              </p>
            </div>

            {/* INFO */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white p-8 rounded-4xl border border-emerald-950/5 space-y-4">
                <GraduationCap className="w-6 h-6 text-emerald-950/20" />

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-950/30 mb-1">
                    Academic Circle
                  </div>

                  <div className="font-serif font-bold text-emerald-950">
                    {profile.school || "Independent"}
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-4xl border border-emerald-950/5 space-y-4">
                <Calendar className="w-6 h-6 text-emerald-950/20" />

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-950/30 mb-1">
                    Member Since
                  </div>

                  <div className="font-serif font-bold text-emerald-950">
                    Late Spring, 2024
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
