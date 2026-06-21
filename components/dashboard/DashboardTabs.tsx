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
  User,
  Trash2,
  Bell,
} from "lucide-react";
import type { DashboardTab, AdminStats } from "@/types/dashboard";
import type { PublicArticle } from "@/types/article";
import type { UserRole } from "@/types/user";
import { isAdminRole, isEditorialRole } from "@/lib/roles";
import SearchBar from "./SearchBar";
import ModerationActions from "./ModerationActions";
import Image from "next/image";

const getStatusChipClass = (status: PublicArticle["status"]) => {
  if (status === "Published") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "Paused") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "Editing") {
    return "bg-purple-400/90 text-purple-950";
  }

  if (status === "Edited") {
    return "bg-cyan-400/90 text-cyan-950";
  }

  return "bg-amber-100 text-amber-700";
};

const getStatusDotClass = (status: PublicArticle["status"]) => {
  if (status === "Published") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "Paused") {
    return "bg-blue-100 text-blue-700";
  }

  if (status === "Editing") {
    return "bg-purple-100 text-purple-700";
  }

  if (status === "Edited") {
    return "bg-pink-100 text-pink-700";
  }

  return "bg-amber-100 text-amber-700";
};
const AdminArticleManagement = dynamic(
  () => import("@/components/dashboard/AdminArticleManagment"),
);
const AdminCategoryManagement = dynamic(
  () => import("@/components/dashboard/AdminCategoryManagment"),
);
const AdminUserManagement = dynamic(
  () => import("@/components/dashboard/AdminUserManagment"),
);
const AdminArticleRecover = dynamic(
  () => import("@/components/dashboard/AdminArticleRecover"),
);
const AdminNotificationManager = dynamic(
  () => import("@/components/dashboard/AdminNotificationManager"),
);

interface DashboardTabsProps {
  user: {
    _id: string;
    firstName: string;
    surname: string;
    role: UserRole;
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

  const dashboardTabs = [
    {
      id: "my-studio" as DashboardTab,
      label: "My Studio",
      icon: LayoutDashboard,
    },
    ...(isAdminRole(user.role)
      ? [
          {
            id: "user-management" as DashboardTab,
            label: "User Management",
            icon: Users,
          },
          {
            id: "all-articles" as DashboardTab,
            label: "Article Control",
            icon: Shield,
          },
          {
            id: "category-management" as DashboardTab,
            label: "Category Management",
            icon: Tag,
          },
          {
            id: "deleted-articles" as DashboardTab,
            label: "Recover Articles",
            icon: Trash2,
          },
          {
            id: "notifications" as DashboardTab,
            label: "Notifications",
            icon: Bell,
          },
        ]
      : user.role === "Editor"
        ? [
            {
              id: "all-articles" as DashboardTab,
              label: "Article Control",
              icon: Shield,
            },
          ]
        : []),
  ];
  const published = userArticles.filter(
    (article) => article.status === "Published" || article.status === "Paused",
  );
  const pending = userArticles.filter(
    (article) =>
      article.status === "Pending" ||
      article.status === "Editing" ||
      article.status === "Edited",
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
      <main className="container mx-auto px-12 py-12 md:py-20">
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

          <div className="flex gap-3 md:gap-4">
            <Link
              href={`/profile/${user._id}`}
              className="flex-1 md:flex-none flex items-center justify-center gap-3 px-4 md:px-10 py-5 bg-emerald-950/10 text-emerald-950 rounded-full font-bold text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] hover:bg-emerald-950/15 transition-all shadow-xl shadow-emerald-950/10 active:scale-95"
            >
              <User className="w-4 h-4 md:w-5 md:h-5" />
              VIEW PROFILE
            </Link>

            <Link
              href="/submit-piece"
              className="flex-1 md:flex-none flex items-center justify-center gap-3 px-4 md:px-10 py-5 bg-emerald-950 text-cream-50 rounded-full font-bold text-[10px] md:text-xs tracking-[0.15em] md:tracking-[0.2em] hover:bg-emerald-900 transition-all shadow-2xl shadow-emerald-950/40 active:scale-95 group"
            >
              <Plus className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-500" />
              SUBMIT WRITING
            </Link>
          </div>
        </div>

        {/* TABS */}

        {isEditorialRole(user.role) && (
          <div className="mb-16 overflow-x-auto scrollbar-hide py-2">
            <div className="flex gap-3 min-w-max pb-2">
              {dashboardTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 flex items-center ml-2 gap-3 px-6 md:px-8 py-4 rounded-full font-bold text-xs tracking-widest transition-all ${
                    activeTab === tab.id
                      ? "bg-emerald-950 text-cream-50 scale-105"
                      : "bg-emerald-950/5 text-emerald-950/40 hover:bg-emerald-950/10"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />

                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {(isAdminRole(user.role)
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
                      <th className="w-[40%] px-12 py-8">Magnum Opus</th>
                      <th className="w-[18%] px-12 py-8 text-center">Realm</th>
                      <th className="w-[18%] px-12 py-8 text-center">
                        Review Stage
                      </th>
                      <th className="w-[12%] px-12 py-8 text-center">
                        Day of Creation
                      </th>
                      <th className="w-[12%] px-12 py-8 text-center">
                        Audience
                      </th>
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
                          className="group hover:bg-emerald-700/5 transition-colors cursor-pointer"
                        >
                          <td className="px-12 py-10">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-2xl bg-emerald-950/5 overflow-hidden relative shadow-sm group-hover:shadow-md transition-all">
                                <Image
                                  src={article.thumbnail as string}
                                  alt={article.title as string}
                                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                                  fill
                                  sizes="64px"
                                />
                              </div>

                              <Link
                                href={`/article/${article._id}`}
                                className="group-hover:text-emerald-700 transition-colors"
                              >
                                <span className="font-serif font-bold text-xl text-emerald-950 group-hover:text-emerald-700 max-w-100px truncate transition-colors">
                                  {article.title}
                                </span>
                              </Link>
                            </div>
                          </td>

                          <td className="px-12 py-10">
                            <div className="flex items-center justify-center">
                              <span className="px-4 py-1.5 bg-emerald-950/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-950 border border-emerald-950/5">
                                {article.category?.name}
                              </span>
                            </div>
                          </td>

                          <td className="px-12 py-10">
                            <div className="flex items-center justify-center gap-3">
                              <span
                                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${getStatusChipClass(article.status)}`}
                              >
                                {article.status}
                              </span>
                            </div>
                          </td>

                          <td className="px-12 py-10 text-sm text-emerald-950/40 font-bold tracking-tight">
                            <div className="flex items-center justify-center gap-2">
                              {article.createdAt
                                ? new Date(
                                    article.createdAt,
                                  ).toLocaleDateString()
                                : "Unknown"}
                            </div>
                          </td>

                          <td className="px-12 py-10">
                            <div className="flex items-center justify-center gap-2 font-bold text-emerald-950">
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
        {activeTab === "user-management" && (
          <AdminUserManagement currentUser={user} />
        )}
        {activeTab === "category-management" && <AdminCategoryManagement />}
        {activeTab === "all-articles" && (
          <AdminArticleManagement currentUser={user} />
        )}
        {activeTab === "deleted-articles" && <AdminArticleRecover />}
        {activeTab === "notifications" && <AdminNotificationManager />}
      </main>
    </div>
  );
}
