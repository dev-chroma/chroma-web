import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Article from "@/models/Article";
import { requireAdmin } from "@/lib/requireAdmin";

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

    const auth = await requireAdmin();

    if (auth.error) {
      return auth.error;
    }

    const { id } = await context.params;

    const article = await Article.findByIdAndUpdate(
      id,
      {
        $unset: {
          deletedAt: 1,
        },
        status: "Pending",
      },
      {
        new: true,
      },
    );

    return NextResponse.json(article);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to recover article",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    await connectDB();

    const auth = await requireAdmin();

    if (auth.error) {
      return auth.error;
    }

    const { id } = await context.params;

    await Article.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to permanently delete article",
      },
      {
        status: 500,
      },
    );
  }
}
