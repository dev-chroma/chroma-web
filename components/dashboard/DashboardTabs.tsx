"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  LayoutDashboard,
  Shield,
  Tag,
  Users,
  Plus,
  CheckCircle2,
  Clock,
  Heart,
} from "lucide-react";
import type { DashboardTab, AdminStats } from "@/types/dashboard";
import type { PublicArticle } from "@/types/article";
import SearchBar from "./SearchBar";
import ModerationActions from "./ModerationActions";
const AdminArticleManagement = dynamic(
  () => import("@/components/dashboard/AdminArticleManagment"),
);
const AdminCategoryManagement = dynamic(
  () => import("@/components/dashboard/AdminCategoryManagment"),
);
const AdminUserManagement = dynamic(
  () => import("@/components/dashboard/AdminUserManagment"),
);

interface DashboardTabsProps {
  user: {
    _id: string;
    firstName: string;
    surname: string;
    role: string;
  };

  userArticles: PublicArticle[];
  pendingReviews: PublicArticle[];
  adminStats: AdminStats;
}

export default function DashboardTabs({
  user,
  userArticles,
  pendingReviews,
  adminStats,
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("my-studio");
  const [searchTerm, setSearchTerm] = useState("");
  const published = userArticles.filter(
    (article) => article.status === "Published",
  );
  const pending = userArticles.filter(
    (article) => article.status === "Pending",
  );
  const totalLikes = userArticles.reduce(
    (acc, curr) => acc + (curr.likes || 0),
    0,
  );
  const totalReads = userArticles.reduce(
    (acc, curr) => acc + (curr.reads || 0),
    0,
  );

  return (
    <div className="font-sans">
      <main className="container mx-auto px-4 py-12 md:py-20">
        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 bg-emerald-950 rounded-full" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-950/40">
                Author Portal
              </span>
            </div>

            <h1 className="text-5xl font-serif font-bold text-emerald-950 mb-4">
              {user.firstName} {user.surname}
              &apos;s Studio
            </h1>

            <p className="text-emerald-950/60 font-medium max-w-md leading-relaxed text-lg italic">
              &quot;Every secret of a writer&apos;s soul, every experience of
              his life, every quality of his mind, is written large in his
              works.&quot;
            </p>
          </div>

          <Link
            href="/submit-piece"
            className="flex items-center justify-center gap-4 px-10 py-5 bg-emerald-950 text-cream-50 rounded-full font-bold text-xs tracking-[0.2em] hover:bg-emerald-900 transition-all shadow-2xl shadow-emerald-950/40 group active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            SUBMIT NEW PIECE
          </Link>
        </div>

        {/* TABS */}

        {user.role === "Admin" && (
          <div className="flex flex-wrap gap-4 mb-16">
            {[
              {
                id: "my-studio",
                label: "My Studio",
                icon: LayoutDashboard,
              },

              {
                id: "user-management",
                label: "User Management",
                icon: Users,
              },

              {
                id: "all-articles",
                label: "Article Control",
                icon: Shield,
              },

              {
                id: "category-management",

                label: "Category Management",

                icon: Tag,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DashboardTab)}
                className={`flex items-center gap-3 px-8 py-4 rounded-full font-bold text-xs tracking-widest transition-all ${
                  activeTab === tab.id
                    ? "bg-emerald-950 text-cream-50 shadow-xl shadow-emerald-950/20 scale-105"
                    : "bg-emerald-950/5 text-emerald-950/40 hover:bg-emerald-950/10"
                }`}
              >
                <tab.icon className="w-4 h-4" />

                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {(user.role === "Admin"
            ? [
                {
                  label: "Total Creators",
                  value: adminStats.totalUsers,
                  icon: Users,
                  color: "text-purple-500",
                  bg: "bg-purple-500/5",
                },
                {
                  label: "Global Submissions",
                  value: adminStats.totalArticles,
                  icon: CheckCircle2,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/5",
                },

                {
                  label: "Pending Reviews",
                  value: adminStats.pendingArticles,
                  icon: Clock,
                  color: "text-amber-500",
                  bg: "bg-amber-500/5",
                },

                {
                  label: "Published Works",
                  value: adminStats.publishedArticles,
                  icon: LayoutDashboard,
                  color: "text-emerald-950",
                  bg: "bg-emerald-950/5",
                },
              ]
            : [
                {
                  label: "Published Works",
                  value: published.length,
                  icon: CheckCircle2,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/5",
                },

                {
                  label: "Pending Review",
                  value: pending.length,
                  icon: Clock,
                  color: "text-amber-500",
                  bg: "bg-amber-500/5",
                },

                {
                  label: "Total Admirers",
                  value: totalLikes,
                  icon: Heart,
                  color: "text-red-500",
                  bg: "bg-red-500/5",
                },

                {
                  label: "Total Reads",
                  value: totalReads,
                  icon: LayoutDashboard,
                  color: "text-emerald-950",
                  bg: "bg-emerald-950/5",
                },
              ]
          ).map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-10 rounded-[2.5rem] border border-emerald-950/5 shadow-2xl shadow-emerald-950/5 group hover:-translate-y-2 transition-all duration-500"
            >
              <div
                className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500`}
              >
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>

              <div className="text-4xl font-serif font-bold text-emerald-950 mb-2">
                {stat.value}
              </div>

              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-950/30">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* MY STUDIO */}

        {activeTab === "my-studio" && (
          <>
            {/* MODERATION */}
            {pendingReviews.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center gap-4 mb-10">
                  <div className="px-5 py-2 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-500/10">
                    Moderation Queue
                  </div>

                  <h2 className="text-3xl font-serif font-bold text-emerald-950">
                    Pending Approval
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pendingReviews.map((article) => (
                    <ModerationActions key={article._id} article={article} />
                  ))}
                </div>
              </div>
            )}
            {/* SUBMISSIONS SECTION */}

            <div className="bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl shadow-emerald-950/5 overflow-hidden mt-10">
              {/* HEADER */}
              <div className="p-10 md:p-12 border-b border-emerald-950/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <h2 className="text-3xl font-serif font-bold text-emerald-950">
                  Recent Submissions
                </h2>
                <div className="flex flex-wrap gap-4">
                  <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                </div>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-emerald-950/2 text-emerald-950/30 text-[10px] uppercase tracking-[0.2em] font-bold">
                      <th className="px-12 py-8">Magnum Opus</th>
                      <th className="px-12 py-8">Realm</th>
                      <th className="px-12 py-8">Review Stage</th>
                      <th className="px-12 py-8">Day of Creation</th>
                      <th className="px-12 py-8">Audience</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-emerald-950/5">
                    {userArticles
                      .filter(
                        (article) =>
                          article.title
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          article.category?.name
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase()),
                      )
                      .map((article) => (
                        <tr
                          key={article._id}
                          className="group hover:bg-emerald-950/1 transition-all cursor-pointer"
                        >
                          <td className="px-12 py-10">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-2xl bg-emerald-950/5 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                                <img
                                  src={article.thumbnail}
                                  alt={article.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                              </div>
                              <span className="font-serif font-bold text-xl text-emerald-950 group-hover:text-emerald-700 transition-colors">
                                {article.title}
                              </span>
                            </div>
                          </td>

                          <td className="px-12 py-10">
                            <span className="px-4 py-1.5 bg-emerald-950/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-950 border border-emerald-950/5">
                              {article.category?.name}
                            </span>
                          </td>

                          <td className="px-12 py-10">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-2.5 h-2.5 rounded-full ${
                                  article.status === "Published"
                                    ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                    : "bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.4)]"
                                }`}
                              />

                              <span
                                className={`text-xs font-bold uppercase tracking-widest ${
                                  article.status === "Published"
                                    ? "text-emerald-600"
                                    : "text-amber-600"
                                }`}
                              >
                                {article.status}
                              </span>
                            </div>
                          </td>

                          <td className="px-12 py-10 text-sm text-emerald-950/40 font-bold tracking-tight">
                            {article.createdAt
                              ? new Date(article.createdAt).toLocaleDateString()
                              : "Unknown"}
                          </td>

                          <td className="px-12 py-10">
                            <div className="flex items-center gap-2 font-bold text-emerald-950">
                              <span className="text-xl font-serif">
                                {article.likes}
                              </span>

                              <span className="text-[10px] uppercase tracking-widest text-emerald-950/30">
                                Admirers
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {/* FOOTER */}

              <div className="p-10 md:p-12 bg-emerald-950/2 flex justify-between items-center border-t border-emerald-950/5">
                <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-950/30">
                  Showing all records
                </p>

                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-xl bg-white border border-emerald-950/5 flex items-center justify-center text-emerald-950 font-bold shadow-sm">
                    1
                  </button>

                  <button className="w-10 h-10 rounded-xl hover:bg-white transition-all flex items-center justify-center text-emerald-950/20 font-bold hover:shadow-sm">
                    2
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ADMIN */}
        {activeTab === "user-management" && <AdminUserManagement />}
        {activeTab === "category-management" && <AdminCategoryManagement />}
        {activeTab === "all-articles" && <AdminArticleManagement />}
      </main>
    </div>
  );
}
