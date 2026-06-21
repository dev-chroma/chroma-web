import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/requireAuth";

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

    const auth = await requireAuth(req);

    if (auth.error) {
      return auth.error;
    }

    const { id } = await context.params;

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

    if (!article.enrolledBy) {
      article.enrolledBy = [];
    }

    const isEnrolled = article.enrolledBy.some(
      (userId: string) => userId.toString() === auth.user.id,
    );

    if (isEnrolled) {
      await Article.findByIdAndUpdate(id, {
        $pull: {
          enrolledBy: auth.user.id,
        },
      });

      return NextResponse.json({
        enrolled: false,
      });
    }

    await Article.findByIdAndUpdate(id, {
      $addToSet: {
        enrolledBy: auth.user.id,
      },
    });

    return NextResponse.json({
      enrolled: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update enrollment",
      },
      {
        status: 500,
      },
    );
  }
}
