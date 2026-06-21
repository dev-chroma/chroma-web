import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/requireRole";
import { createNotification } from "@/lib/createNotification";
import type { ArticleStatus } from "@/types/article";

import Article from "@/models/Article";

const allowedStatuses: ArticleStatus[] = [
  "Draft",
  "Pending",
  "Editing",
  "Edited",
  "Published",
  "Paused",
];

export async function PATCH(
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

    console.log("STATUS ARTICLE ID:", id);

    const auth = await requireRole(req, ["Admin", "Editor"]);

    if (auth.error) {
      return auth.error;
    }

    const body = await req.json();

    const { status, assignedEditor } = body as {
      status?: ArticleStatus;
      assignedEditor?: string | null;
    };

    if (status !== undefined && !allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          message: "Invalid article status",
        },
        {
          status: 400,
        },
      );
    }

    const originalArticle = await Article.findById(id);

    if (!originalArticle) {
      return NextResponse.json(
        {
          message: "Article not found",
        },
        {
          status: 404,
        },
      );
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) {
      updateData.status = status;
    }
    if (assignedEditor !== undefined) {
      updateData.assignedEditor = assignedEditor ? assignedEditor : null;
      if (assignedEditor && status === undefined) {
        updateData.status = "Editing";
      }
    }

    const article = await Article.findByIdAndUpdate(
      id,
      updateData,
      {
        returnDocument: "after",
      },
    )
      .populate("author", "firstName surname email avatar")
      .populate("category", "_id name slug")
      .populate("assignedEditor", "firstName surname email avatar role");

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

    if (status && status !== originalArticle.status) {
      if (status === "Published") {
        await createNotification({
          title: "Article Published",
          message: `Congratulations! Your article "${article.title}" is now live.`,
          createdBy: auth.user.id,
          recipients: [article.author._id.toString()],
          type: "Article",
        });
      } else if (status === "Draft") {
        await createNotification({
          title: "Article Needs Revision",
          message: `Your article "${article.title}" was moved back to Draft.`,
          createdBy: auth.user.id,
          recipients: [article.author._id.toString()],
          type: "Article",
        });
      }
    }

    if (
      assignedEditor !== undefined &&
      String(assignedEditor || "") !== String(originalArticle.assignedEditor || "")
    ) {
      if (assignedEditor) {
        await createNotification({
          title: "Article Assigned",
          message: `You have been assigned to review "${article.title}".`,
          createdBy: auth.user.id,
          recipients: [assignedEditor],
          type: "Article",
        });
      }
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update status",
      },
      {
        status: 500,
      },
    );
  }
}
