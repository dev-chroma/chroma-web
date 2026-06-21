import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";

import "@/models/User";
import "@/models/Category";

import Article from "@/models/Article";
import User from "@/models/User";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { isAdminRole, isEditorialRole } from "@/lib/roles";

export default async function DashboardPage() {
  await connectDB();
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  console.time("dashboard-query");

  // PARALLEL FETCHING
  const [
    userArticles,
    pendingReviews,
    totalUsers,
    totalArticles,
    pendingArticles,
    publishedArticles,
  ] = await Promise.all([
    Article.find({
      author: user._id,
      deletedAt: {
        $exists: false,
      },
    })
      .select("title thumbnail status likes reads createdAt category")
      .populate("category", "name slug")
      .sort({
        createdAt: -1,
      })
      .lean(),
    isAdminRole(user.role)
      ? Article.find({
          status: { $in: ["Pending", "Editing", "Edited"] },
        })
          .select("title thumbnail status author category createdAt")
          .populate("author", "firstName surname avatar")
          .populate("category", "name slug")
          .lean()
      : [],

    isAdminRole(user.role) ? User.countDocuments() : 0,
    isAdminRole(user.role) ? Article.countDocuments() : 0,
    isAdminRole(user.role)
      ? Article.countDocuments({
          status: { $in: ["Pending", "Editing", "Edited"] },
        })
      : 0,
    isAdminRole(user.role)
      ? Article.countDocuments({
          status: { $in: ["Published", "Paused"] },
        })
      : 0,
  ]);

  console.timeEnd("dashboard-query");

  const serializedUser = JSON.parse(JSON.stringify(user));
  const serializedArticles = JSON.parse(JSON.stringify(userArticles));
  const serializedPending = JSON.parse(JSON.stringify(pendingReviews));

  const stats = {
    totalUsers,
    totalArticles,
    pendingArticles,
    publishedArticles,
  };

  console.log("Articles:", JSON.stringify(userArticles).length / 1024, "KB");

  return (
    <DashboardTabs
      user={serializedUser}
      userArticles={serializedArticles}
      pendingReviews={serializedPending}
      adminStats={stats}
    />
  );
}
