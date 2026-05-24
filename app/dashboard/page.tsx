"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import type {
  DashboardTab,
  AdminStats,
} from "@/types/dashboard";
import type { ArticleStatus, PublicArticle } from "@/types/article";
import {
  Clock,
  CheckCircle2,
  Heart,
  Plus,
  LayoutDashboard,
  Search,
  Filter,
  Users,
  Shield,
  Tag,
} from "lucide-react";
import Image from "next/image";
import AdminArticleManagement from "@/components/dashboard/AdminArticleManagment";
import AdminCategoryManagement from "@/components/dashboard/AdminCategoryManagment";
import AdminUserManagement from "@/components/dashboard/AdminUserManagment";

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [userArticles, setUserArticles] = useState<PublicArticle[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PublicArticle[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>("my-studio");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const myArticles = await api.articles.getMyArticles();
        setUserArticles(myArticles.articles);

        if (user.role === "Admin" || user.role === "Editor") {
          const pending = await api.articles.list({ status: "Pending" });
          setPendingReviews(pending.articles);
        }

        if (user.role === "Admin") {
          try {
            const stats = await api.admin.getStats();
            setAdminStats(stats);
          } catch {
            console.error("Failed to fetch admin stats");
          }
        }
      } catch (error: unknown) {
        console.error(
          "Failed to fetch dashboard data:",
          (error as Error).message,
        );
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchDashboardData();
  }, [user, authLoading]);

  const handleStatusUpdate = async (id: string, status: ArticleStatus) => {
    try {
      await api.articles.updateStatus(id, status);
      // Refresh data
      const myArticles = await api.articles.getMyArticles();
      setUserArticles(myArticles.articles);

      if (user?.role === "Admin" || user?.role === "Editor") {
        const pending = await api.articles.list({ status: "Pending" });
        setPendingReviews(pending.articles);
      }
    } catch (error: unknown) {
      console.error("Failed to update status:", (error as Error).message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="w-12 h-12 border-4 border-emerald-950/10 border-t-emerald-950 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-50 gap-6">
        <h2 className="text-3xl font-serif font-bold text-emerald-950">
          Access Denied
        </h2>
        <p className="text-emerald-950/60 font-medium">
          Please sign in to access your studio.
        </p>
        <button
          onClick={() => router.push("/auth")}
          className="px-10 py-4 bg-emerald-950 text-cream-50 rounded-full font-bold text-sm tracking-widest"
        >
          SIGN IN
        </button>
      </div>
    );
  }

  const published = userArticles.filter(
    (a: PublicArticle) => a.status === "Published",
  );
  const pending = userArticles.filter(
    (a: PublicArticle) => a.status === "Pending",
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
    <div className="font-sans selection:bg-emerald-950 selection:text-white">
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 bg-emerald-950 rounded-full" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-950/40">
                Author Portal
              </span>
            </div>
            <h1 className="text-5xl font-serif font-bold text-emerald-950 mb-4">
              {user.firstName + " " + user.surname}&apos;s Studio
            </h1>
            <p className="text-emerald-950/60 font-medium max-w-md leading-relaxed text-lg italic">
              &quot;Every secret of a writer&apos;s soul, every experience of
              his life, every quality of his mind, is written large in his
              works&period;&quot;
            </p>
          </div>
          <button
            onClick={() => router.push("/submit-piece")}
            className="flex items-center justify-center gap-4 px-10 py-5 bg-emerald-950 text-cream-50 rounded-full font-bold text-xs tracking-[0.2em] hover:bg-emerald-900 transition-all shadow-2xl shadow-emerald-950/40 group active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
            SUBMIT NEW PIECE
          </button>
        </div>

        {/* Tab Switching for Admin */}
        {user.role === "Admin" && (
          <div className="flex flex-wrap gap-4 mb-16">
            {[
              { id: "my-studio", label: "My Studio", icon: LayoutDashboard },
              { id: "user-management", label: "User Management", icon: Users },
              { id: "all-articles", label: "Article Control", icon: Shield },
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {(user.role === "Admin" && adminStats
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

        {activeTab === "my-studio" ? (
          <>
            {/* Admin/Editor Moderation Section */}
            {(user.role === "Admin" || user.role === "Editor") &&
              pendingReviews.length > 0 && (
                <div className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="px-5 py-2 bg-amber-500/10 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-amber-500/10">
                      Moderation Queue
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-emerald-950">
                      Pending Approval
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pendingReviews.map((article: PublicArticle) => (
                      <div
                        key={article._id}
                        className="bg-white p-8 rounded-4xl border border-emerald-950/5 shadow-xl hover:shadow-2xl transition-all group"
                      >
                        <div className="h-48 rounded-2xl bg-emerald-950/5 mb-6 overflow-hidden">
                          <Image
                            src={article.thumbnail || "/placeholder.png"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            alt=""
                            width={400}
                            height={300}
                          />
                        </div>
                        <h3 className="font-serif font-bold text-xl text-emerald-950 mb-2 truncate">
                          {article.title}
                        </h3>
                        <p className="text-xs text-emerald-950/40 mb-6 flex items-center gap-2">
                          <span>by</span>
                          <span className="font-bold text-emerald-950/60 uppercase tracking-widest">
                            {article.author.firstName +
                              " " +
                              article.author.surname}
                          </span>
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() =>
                              handleStatusUpdate(article._id, "Published")
                            }
                            className="flex-1 min-w-25 py-3 cursor-pointer bg-emerald-950 text-cream-50 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              router.push(`/edit-piece/${article._id}`)
                            }
                            className="flex-1 min-w-25 py-3 bg-emerald-950/5 text-emerald-950 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-950/10 transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (
                                window.confirm(
                                  "Are you sure you want to archive this article? It will be permanently deleted after 7 days.",
                                )
                              ) {
                                try {
                                  await api.articles.delete(article._id);
                                  // Refresh data
                                  const myArticles =
                                    await api.articles.getMyArticles();
                                  setUserArticles(myArticles.articles);
                                  if (
                                    user?.role === "Admin" ||
                                    user?.role === "Editor"
                                  ) {
                                    const pending = await api.articles.list({
                                      status: "Pending",
                                    });
                                    setPendingReviews(pending.articles);
                                  }
                                } catch {
                                  console.error("Archive failed");
                                }
                              }
                            }}
                            className="px-6 py-3 border border-emerald-950/10 text-emerald-950/40 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-500 hover:border-red-500/20 transition-all"
                          >
                            Archive
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Submissions Section */}
            <div className="bg-white rounded-[3rem] border border-emerald-950/5 shadow-2xl shadow-emerald-950/5 overflow-hidden">
              <div className="p-10 md:p-12 border-b border-emerald-950/5 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <h2 className="text-3xl font-serif font-bold text-emerald-950">
                  Recent Submissions
                </h2>
                <div className="flex flex-wrap gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-950/30" />
                    <input
                      type="text"
                      placeholder="Search piece..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-emerald-950/5 border-none rounded-xl py-3 pl-12 pr-6 text-sm font-medium w-64 outline-none focus:ring-2 focus:ring-emerald-950/10 transition-all"
                    />
                  </div>
                  <button className="flex items-center gap-2 py-3 px-6 bg-emerald-950/5 text-emerald-950 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-950/10 transition-all">
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                </div>
              </div>

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
                      .map((article: PublicArticle) => (
                        <tr
                          key={article._id}
                          className="group hover:bg-emerald-950/1 transition-all cursor-pointer"
                        >
                          <td className="px-12 py-10">
                            <div className="flex items-center gap-6">
                              <div className="w-16 h-16 rounded-2xl bg-emerald-950/5 flex items-center justify-center text-emerald-950 overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                                <Image
                                  src={article.thumbnail || "/placeholder.png"}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  alt=""
                                  width={64}
                                  height={64}
                                />
                              </div>
                              <span className="font-serif font-bold text-xl text-emerald-950 group-hover:text-emerald-700 transition-colors">
                                {article.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-12 py-10">
                            <span className="px-4 py-1.5 bg-emerald-950/5 rounded-full text-[10px] font-bold uppercase tracking-wider text-emerald-950 border border-emerald-950/5">
                              {article.category?.name || "Uncategorized"}
                            </span>
                          </td>
                          <td className="px-12 py-10">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-2.5 h-2.5 rounded-full ${article.status === "Published" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-amber-400 animate-pulse-slow shadow-[0_0_10px_rgba(251,191,36,0.4)]"}`}
                              />
                              <span
                                className={`text-xs font-bold uppercase tracking-widest ${article.status === "Published" ? "text-emerald-600" : "text-amber-600"}`}
                              >
                                {article.status}
                              </span>
                            </div>
                          </td>
                          <td className="px-12 py-10 text-sm text-emerald-950/40 font-bold tracking-tight">
                            {article.createdAt}
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
              <div className="p-10 md:p-12 bg-emerald-950/1 flex justify-between items-center">
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
        ) : activeTab === "user-management" ? (
          <AdminUserManagement />
        ) : activeTab === "category-management" ? (
          <AdminCategoryManagement />
        ) : (
          <AdminArticleManagement />
        )}
      </main>
    </div>
  );
}
