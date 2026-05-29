import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";

import "@/models/User";
import "@/models/Category";

import Article from "@/models/Article";
import User from "@/models/User";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { getCurrentUser } from "@/lib/getCurrentUser";

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
    user.role === "Admin" || user.role === "Editor"
      ? Article.find({
          status: "Pending",
        })
          .select("title thumbnail status author category createdAt")
          .populate("author", "firstName surname avatar")
          .populate("category", "name slug")
          .lean()
      : [],

    user.role === "Admin" ? User.countDocuments() : 0,
    user.role === "Admin" ? Article.countDocuments() : 0,
    user.role === "Admin"
      ? Article.countDocuments({
          status: "Pending",
        })
      : 0,
    user.role === "Admin"
      ? Article.countDocuments({
          status: "Published",
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
