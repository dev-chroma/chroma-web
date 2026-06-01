import { redirect } from "next/navigation";
import Image from "next/image";
import { Mail, GraduationCap, Calendar, Edit3 } from "lucide-react";
import { connectDB } from "@/lib/db";
import Link from "next/link";

import "@/models/User";
import "@/models/Article";
import "@/models/Category";

import User from "@/models/User";
import Article from "@/models/Article";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { getCurrentUser } from "@/lib/getCurrentUser";
import ProfileAvatarUpload from "@/components/ProfileAvatarUpload";

interface ProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  await connectDB();

  const { id } = await params;
  const currentUser = await getCurrentUser();

  const isOwnProfile = currentUser?._id?.toString() === id;
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

      <div className="relative pt-20 pb-32 overflow-hidden">
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

              {isOwnProfile && <ProfileAvatarUpload />}
            </div>

            {/* CONTENT */}

            <div className="flex-1 text-center md:text-left space-y-6 pt-4">
              <div className="space-y-3">
                <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-4">
                  <h1 className="text-4xl md:text-6xl font-serif font-bold text-emerald-950">
                    {profile.firstName} {profile.surname}
                  </h1>

                  {isOwnProfile && (
                    <Link
                      href="/profile/edit"
                      className="self-center md:self-auto md:shrink-0 group inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-emerald-950/10 bg-white/70 backdrop-blur-sm text-emerald-950 hover:bg-emerald-950 hover:text-white transition-all duration-300 shadow-sm hover:shadow-xl
      "
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="text-sm font-medium">Edit Profile</span>
                    </Link>
                  )}
                </div>

                <p className="text-emerald-600 font-bold uppercase tracking-[0.3em] text-xs">
                  {profile.school || "Independent Voice"}
                </p>
              </div>

              <p className="text-xl text-emerald-950/60 font-medium leading-relaxed max-w-2xl">
                {profile.bio ||
                  "A creative soul weaving stories and capturing moments through the power of written expression."}
              </p>

              <div className="flex flex-wrap items-center justify-start gap-4 pt-6 px-4 md:px-0">
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
