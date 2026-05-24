import { NextResponse }
from "next/server";

import { connectDB }
from "@/lib/db";

import { requireAuth }
from "@/lib/requireAuth";

import Article
from "@/models/Article";

import "@/models/User";
import "@/models/Category";
import { PopulatedArticle } from "@/types/article";

export async function GET(req: Request) {
  try {
    await connectDB();

    const auth = await requireAuth(req);

    if (auth.error) {
      return auth.error;
    }

    const articles = await Article.find({
      author: auth.user.id,
      deletedAt: {
        $exists: false,
      },
    })
      .populate("category", "name")
      .sort({
        createdAt: -1,
      })
      .lean<PopulatedArticle[]>();

    const processedArticles = articles.map((article: PopulatedArticle) => ({
      ...article,
      category:
        typeof article.category === "object" && article.category !== null
          ? article.category.name
          : "Uncategorized",
    }));

    return NextResponse.json({ articles: processedArticles });
  } catch (error) {
    console.error(error);

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
