"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, GraduationCap, Calendar, ArrowLeft } from "lucide-react";
import { api } from "@/services/api";
import type { PublicArticle } from "@/types/article";
import type { PublicUser } from "@/types/user";
import ArticleCard from "@/components/ArticleCard";
import Image from "next/image";

const ProfilePage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [profile, setProfile] = useState<PublicUser | null>(null);
  const [articles, setArticles] = useState<PublicArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"chronicles" | "about">(
    "chronicles",
  );

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const userData = await api.users.getPublicProfile(id);

        setProfile(userData);

        const userArticles = await api.articles.list({
          author: id,
          status: "Published",
        });

        setArticles(userArticles.articles || []);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();

    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="w-12 h-12 border-4 border-emerald-950/10 border-t-emerald-950 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-50 py-20 text-center px-4">
        <h2 className="text-4xl font-serif font-bold text-emerald-950 mb-4">
          Voice Lost to Time
        </h2>

        <p className="text-emerald-950/60 font-medium mb-12 max-w-md">
          The creator you seek is not currently in our records.
        </p>

        <button
          onClick={() => router.push("/")}
          className="px-10 py-4 bg-emerald-950 text-cream-50 rounded-full font-bold text-[10px] tracking-[0.3em] uppercase hover:bg-emerald-900 transition-all"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 min-h-screen font-sans selection:bg-emerald-950 selection:text-white pb-32">
      {/* PROFILE HEADER */}

      <div className="relative pt-20 pb-32 overflow-hidden border-b border-emerald-950/5">
        <div className="container mx-auto px-4 relative z-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-3 text-emerald-950/40 hover:text-emerald-950 transition-all font-bold text-[10px] uppercase tracking-[0.3em] mb-16 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 max-w-5xl mx-auto">
            {/* AVATAR */}

            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-950 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />

              {profile.avatar ? (
                <Image
                  src={profile.avatar}
                  alt={profile.firstName}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] object-cover border-8 border-white shadow-2xl relative z-10"
                  fill
                />
              ) : (
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-[3rem] bg-emerald-950 text-cream-50 flex items-center justify-center text-7xl font-serif font-bold border-8 border-white shadow-2xl relative z-10">
                  {profile.firstName?.[0]}
                </div>
              )}

              <div className="absolute -bottom-4 -right-4 bg-white px-6 py-2 rounded-2xl shadow-xl border border-emerald-950/5 z-20">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-950">
                  {profile.role}
                </span>
              </div>
            </div>

            {/* CONTENT */}

            <div className="flex-1 text-center md:text-left space-y-6 pt-4">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-emerald-950">
                  {profile.firstName} {profile.surname}
                </h1>

                <p className="text-emerald-600 font-bold uppercase tracking-[0.3em] text-xs">
                  {profile.school || "Independent Voice"}
                </p>
              </div>

              <p className="text-xl text-emerald-950/60 font-medium leading-relaxed max-w-2xl">
                {profile.bio ||
                  "A creative soul weaving stories and capturing moments through the power of written expression."}
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 pt-6">
                <div className="flex items-center gap-3 text-emerald-950/40">
                  <Mail className="w-4 h-4" />

                  <span className="text-xs font-bold tracking-widest">
                    {profile.email}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-emerald-950/40">
                  <GraduationCap className="w-4 h-4" />

                  <span className="text-xs font-bold tracking-widest">
                    {profile.school || "Academic Circle"}
                  </span>
                </div>

                {profile.dateOfBirth && (
                  <div className="flex items-center gap-3 text-emerald-950/40">
                    <Calendar className="w-4 h-4" />

                    <span className="text-xs font-bold tracking-widest">
                      Born {new Date(profile.dateOfBirth).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* DECORATION */}

        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-950/3 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />

        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-800/3 rounded-full -ml-32 -mb-32 blur-2xl pointer-events-none" />
      </div>

      {/* CONTENT */}

      <div className="container mx-auto px-4 mt-20">
        <div className="max-w-7xl mx-auto">
          {/* TABS */}

          <div className="flex justify-center md:justify-start items-center gap-12 mb-20 border-b border-emerald-950/5 pb-8">
            <button
              onClick={() => setActiveTab("chronicles")}
              className={`relative text-[10px] font-bold uppercase tracking-[0.4em] transition-all ${
                activeTab === "chronicles"
                  ? "text-emerald-950"
                  : "text-emerald-950/20 hover:text-emerald-950/40"
              }`}
            >
              Published Chronicles
              {activeTab === "chronicles" && (
                <div className="absolute -bottom-9 left-0 right-0 h-1 bg-emerald-950 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className={`relative text-[10px] font-bold uppercase tracking-[0.4em] transition-all ${
                activeTab === "about"
                  ? "text-emerald-950"
                  : "text-emerald-950/20 hover:text-emerald-950/40"
              }`}
            >
              The Author&apos;s Path
              {activeTab === "about" && (
                <div className="absolute -bottom-9 left-0 right-0 h-1 bg-emerald-950 rounded-full" />
              )}
            </button>
          </div>

          {/* ARTICLES */}

          {activeTab === "chronicles" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
    </div>
  );
};

export default ProfilePage;
