import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Article from "@/models/Article";
import { PopulatedArticle } from "@/types/article";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query");

    const page = Number(searchParams.get("page") || 1);

    const limit = Number(searchParams.get("limit") || 10);

    if (!query) {
      return NextResponse.json(
        {
          message: "Search query is required",
        },
        {
          status: 400,
        },
      );
    }

    const articles = await Article.find({
      $text: {
        $search: query,
      },
      status: "Published",
    })
      .populate("author", "firstName surname email")
      .populate("category", "name")
      .limit(limit)
      .skip((page - 1) * limit)
      .lean<PopulatedArticle[]>();

    const total = await Article.countDocuments({
      $text: {
        $search: query,
      },
      status: "Published",
    });

    const processedArticles = articles.map((article: PopulatedArticle) => ({
      ...article,
      category: typeof article.category === "object" && article.category !== null ? article.category.name : "Uncategorized",
    }));

    return NextResponse.json({
      articles: processedArticles,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalArticles: total,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Search failed",
      },
      {
        status: 500,
      },
    );
  }
}
