import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/requireAuth";

import "@/models/User";

import Article from "@/models/Article";
import Comment from "@/models/Comment";

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

    const body = await req.json();

    const { content } = body;

    if (!content) {
      return NextResponse.json(
        {
          message: "Comment content is required",
        },
        {
          status: 400,
        },
      );
    }

    const comment = await Comment.create({
      article: id,
      author: auth.user.id,
      content,
    });

    await Article.findByIdAndUpdate(id, {
      $inc: {
        commentsCount: 1,
      },
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "firstName surname avatar")
      .lean();

    return NextResponse.json(populatedComment, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to add comment",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(
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

    const comments = await Comment.find({
      article: id,
    })
      .populate("author", "firstName surname avatar")
      .sort({
        createdAt: -1,
      })
      .lean();

    return NextResponse.json(comments);
  } catch (error) {
    console.error("COMMENTS GET ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch comments",
      },
      {
        status: 500,
      },
    );
  }
}
