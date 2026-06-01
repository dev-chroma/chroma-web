import { NextResponse } from "next/server";
import mongoose from "mongoose";
import type { SortOrder } from "mongoose";

import { connectDB } from "@/lib/db";
import { requireRole } from "@/lib/requireRole";

import "@/models/User";
import Article from "@/models/Article";
import Category from "@/models/Category";
import { PopulatedArticle } from "@/types/article";

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

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const category = searchParams.get("category");
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const author = searchParams.get("author");
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy");

    const query: Record<string, unknown> = {
      deletedAt: {
        $exists: false,
      },
    };

    // STATUS
    if (status) {
      query.status = status;
    } else {
      query.status = "Published";
    }

    // AUTHOR
    if (author) {
      query.author = author;
    }

    // CATEGORY
    if (category) {
      let foundCategory = null;

      // ObjectId
      if (mongoose.Types.ObjectId.isValid(category)) {
        foundCategory = await Category.findById(category);
      }

      // Name or slug
      if (!foundCategory) {
        foundCategory = await Category.findOne({
          $or: [
            {
              name: {
                $regex: new RegExp(`^${category}$`, "i"),
              },
            },
            {
              slug: category.toLowerCase(),
            },
          ],
        });
      }

      if (foundCategory) {
        query.category = foundCategory._id;
      } else {
        return NextResponse.json({
          articles: [],
          totalPages: 0,
          currentPage: page,
          totalArticles: 0,
        });
      }
    }

    let sortOption: Record<string, SortOrder> = {
      createdAt: -1,
    };

    if (sortBy === "likes") {
      sortOption = {
        likes: -1,
        createdAt: -1,
      };
    }

    const articles = await Article.find(query)
      .populate("author", "firstName surname email avatar")
      .populate("category", "_id name slug")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Article.countDocuments(query);

    return NextResponse.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalArticles: total,
    });
  } catch (error) {
    console.error("ARTICLES API ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch articles",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(req: Request) {
  console.log("POST /api/articles HIT");
  try {
    await connectDB();

    const auth = await requireRole(req, ["Author", "Admin", "Editor"]);

    if (auth.error) {
      return auth.error;
    }

    const body = await req.json();
    console.log("REQUEST BODY:", body);

    const {
      title,
      excerpt,
      content,
      category: categoryInput,
      thumbnail,
      featuredImage,
      readTime,
    } = body;

    const categoryId = await resolveCategoryId(categoryInput);

    if (!categoryId) {
      return NextResponse.json(
        {
          message: "Category is required",
        },
        {
          status: 400,
        },
      );
    }

    console.log("READ TIME BEFORE SAVE:", readTime);

    const article = await Article.create({
      title,
      excerpt,
      content,
      category: categoryId,
      thumbnail: thumbnail || featuredImage,
      featuredImage: featuredImage || thumbnail,
      readTime,
      author: auth.user.id,
      status: "Pending",
    });

    console.log("SAVED ARTICLE:", article.readTime);

    const populatedArticle = await Article.findById(article._id)
      .populate("category", "name")
      .lean<PopulatedArticle | null>();

    return NextResponse.json(populatedArticle, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to create article",
      },
      {
        status: 500,
      },
    );
  }
}
