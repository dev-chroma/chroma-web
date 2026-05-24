import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/requireRole";

import Article from "@/models/Article";

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

    const { status } = body;

    const article = await Article.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        returnDocument: "after",
      },
    );

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
