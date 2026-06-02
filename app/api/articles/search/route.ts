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
      status: "Published",
    })
      .populate("author", "firstName surname email school avatar")
      .populate("category", "name slug")
      .lean<PopulatedArticle[]>();

    const search = query.toLowerCase();

    const filteredArticles = articles.filter((article) => {
      const author = typeof article.author === "object" ? article.author : null;

      const category =
        typeof article.category === "object" ? article.category : null;

      const searchableText = [
        article.title,
        article.excerpt,
        article.content,

        author?.firstName,
        author?.surname,
        author?.school,
        author?.email,

        category?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(search);
    });

    const paginatedArticles = filteredArticles.slice(
      (page - 1) * limit,
      page * limit,
    );

    return NextResponse.json({
      articles: paginatedArticles,
      totalPages: Math.ceil(filteredArticles.length / limit),
      currentPage: page,
      totalArticles: filteredArticles.length,
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
