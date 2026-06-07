import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db";
import { requireAuth } from "@/lib/requireAuth";
import "@/models/User";
import "@/models/Category";

import Article from "@/models/Article";
import Category from "@/models/Category";
import { PopulatedArticle } from "@/types/article";
import { createNotification } from "@/lib/createNotification";

const resolveCategoryId = async (categoryInput: string) => {
  if (!categoryInput) {
    return null;
  }

  if (mongoose.Types.ObjectId.isValid(categoryInput)) {
    return categoryInput;
  }

  let category = await Category.findOne({
    name: {
      $regex: new RegExp(`^${categoryInput}$`, "i"),
    },
  });

  if (!category) {
    category = await Category.create({
      name: categoryInput,
      slug: categoryInput.toLowerCase().replace(/\s+/g, "-"),
    });
  }

  return category._id;
};

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
    console.log("ARTICLE ID:", id);
    const allArticles = await Article.find();
    console.log("ALL ARTICLES:", allArticles);

    const article = await Article.findById(id)
      .populate("author", "firstName surname role school bio avatar")
      .populate("category", "_id name")
      .lean<PopulatedArticle | null>();

    if (!article || article.deletedAt) {
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
        message: "Failed to fetch article",
      },
      {
        status: 500,
      },
    );
  }
}

export async function PUT(
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

    if (
      article.author.toString() !== auth.user.id &&
      auth.user.role !== "Admin"
    ) {
      return NextResponse.json(
        {
          message: "Access denied",
        },
        {
          status: 403,
        },
      );
    }

    const body = await req.json();

    const {
      title,
      excerpt,
      content,
      category: categoryInput,
      thumbnail,
      featuredImage,
      readTime,
    } = body;

    const categoryId = categoryInput
      ? await resolveCategoryId(categoryInput)
      : article.category;

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        title,
        excerpt,
        content,
        category: categoryId,
        thumbnail: thumbnail || featuredImage,
        featuredImage: featuredImage || thumbnail,
        readTime,
        status: "Pending",
      },
      {
        new: true,
      },
    );

    await createNotification({
      title: "Article Resubmitted",
      message: `"${title}" has been submitted for review.`,
      recipients: [auth.user.id],
      type: "Article",
    });

    return NextResponse.json(updatedArticle);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update article",
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

    if (
      article.author.toString() !== auth.user.id &&
      auth.user.role !== "Admin"
    ) {
      return NextResponse.json(
        {
          message: "Access denied",
        },
        {
          status: 403,
        },
      );
    }

    await Article.findByIdAndUpdate(id, {
      deletedAt: new Date(),
      status: "Draft",
    });

    await createNotification({
      title: "Article Archived",
      message: `"${article.title}" has been archived.`,
      recipients: [article.author.toString()],
      type: "Article",
    });

    return NextResponse.json({
      message: "Article archived successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete article",
      },
      {
        status: 500,
      },
    );
  }
}
