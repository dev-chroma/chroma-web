import { redirect } from "next/navigation";

import Image from "next/image";
import { Mail, GraduationCap, Calendar } from "lucide-react";

import { connectDB } from "@/lib/db";

import "@/models/User";
import "@/models/Article";
import "@/models/Category";

import User from "@/models/User";
import Article from "@/models/Article";

import ProfileTabs from "@/components/profile/ProfileTabs";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  await connectDB();

  const { id } = await params;
  const [profile, articles] = await Promise.all([
    User.findById(id).lean(),

    Article.find({
      author: id,

      status: "Published",
    })
      .populate("author", "firstName surname avatar")
      .populate("category", "name slug")
      .sort({
        createdAt: -1,
      })
      .lean(),
  ]);

  if (!profile) {
    redirect("/");
  }

  const serializedProfile = JSON.parse(JSON.stringify(profile));

  const serializedArticles = JSON.parse(JSON.stringify(articles));

  return (
    <div className="bg-cream-50 min-h-screen font-sans pb-32">
      {/* HEADER */}

      <div className="relative pt-20 pb-32 overflow-hidden border-b border-emerald-950/5">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 max-w-5xl mx-auto">
            {/* AVATAR */}

            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-950 rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity" />

              {profile.avatar ? (
                <div className="relative w-48 h-48 md:w-64 md:h-64">
                  <Image
                    src={profile.avatar}
                    alt={profile.firstName}
                    fill
                    className="rounded-[3rem] object-cover border-8 border-white shadow-2xl relative z-10"
                  />
                </div>
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

        {/* DECOR */}

        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-950/3 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none" />

        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-800/3 rounded-full -ml-32 -mb-32 blur-2xl pointer-events-none" />
      </div>

      {/* CLIENT TABS */}

      <ProfileTabs profile={serializedProfile} articles={serializedArticles} />
    </div>
  );
}
