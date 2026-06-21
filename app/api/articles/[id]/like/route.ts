import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/requireAuth";

import "@/models/User";
import { createNotification } from "@/lib/createNotification";

import Article from "@/models/Article";

export async function POST(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const auth = await requireAuth(req);

    if (auth.error) {
      return auth.error;
    }

    const article = await Article.findById(id);

    if (!article) {
      return NextResponse.json(
        {
          message: "Article not found",
        },
        {
          status: 404,
        },
      );
    }

    // FIX OLD DOCUMENTS
    if (!article.likedBy) {
      article.likedBy = [];
    }

    const alreadyLiked = article.likedBy.some(
      (userId: string) => userId.toString() === auth.user.id,
    );

    // UNLIKE
    if (alreadyLiked) {
      article.likes = Math.max(article.likes - 1, 0);

      article.likedBy = article.likedBy.filter(
        (userId: string) => userId.toString() !== auth.user.id,
      );

      await article.save();

      return NextResponse.json({
        liked: false,
        likes: article.likes,
      });
    }

    // LIKE
    article.likes += 1;

    article.likedBy.push(auth.user.id);

    await article.save();

    if (article.author.toString() !== auth.user.id) {
      await createNotification({
        title: "New Like",
        message: `Someone liked your article "${article.title}".`,
        createdBy: auth.user.id,
        recipients: [article.author.toString()],
        type: "General",
      });
    }

    return NextResponse.json({
      liked: true,
      likes: article.likes,
    });
  } catch (error) {
    console.error("LIKE ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to update like",
      },
      {
        status: 500,
      },
    );
  }
}
