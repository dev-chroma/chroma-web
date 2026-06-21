import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import { requireRole } from "@/lib/requireRole";

import User from "@/models/User";
import Article from "@/models/Article";
import Comment from "@/models/Comment";

export async function GET(req: Request) {
  try {
    await connectDB();

    const auth = await requireRole(req, ["Admin"]);

    if (auth.error) {
      return auth.error;
    }

    const [
      totalUsers,
      totalArticles,
      totalComments,
      publishedArticles,
      pendingArticles,
      draftArticles,
      totalReads,
    ] = await Promise.all([
      User.countDocuments(),

      Article.countDocuments({
        deletedAt: {
          $exists: false,
        },
      }),

      Comment.countDocuments(),

      Article.countDocuments({
        status: { $in: ["Published", "Paused"] },
        deletedAt: {
          $exists: false,
        },
      }),

      Article.countDocuments({
        status: { $in: ["Pending", "Editing", "Edited"] },
        deletedAt: {
          $exists: false,
        },
      }),

      Article.countDocuments({
        status: "Draft",
        deletedAt: {
          $exists: false,
        },
      }),

      Article.aggregate([
        {
          $group: {
            _id: null,
            total: {
              $sum: "$reads",
            },
          },
        },
      ]),
    ]);

    return NextResponse.json({
      totalUsers,
      totalArticles,
      totalComments,
      publishedArticles,
      pendingArticles,
      draftArticles,
      totalReads: totalReads[0]?.total || 0,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to fetch admin stats",
      },
      {
        status: 500,
      },
    );
  }
}
