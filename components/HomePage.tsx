import Hero from "@/components/Hero";
import ArticleCard from "@/components/ArticleCard";
import Sidebar from "@/components/Sidebar";

import { connectDB } from "@/lib/db";

import Article from "@/models/Article";

import "@/models/User";
import "@/models/Category";
import { PublicArticle } from "@/types/article";

interface HomePageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  await connectDB();

  const { category } = await searchParams;

  const query: Record<string, unknown> = {
    status: "Published",
    deletedAt: {
      $exists: false,
    },
  };

  // CATEGORY FILTER
  if (category) {
    const foundCategory = await (
      await import("@/models/Category")
    ).default.findOne({
      slug: category.toLowerCase(),
    });

    if (foundCategory) {
      query.category = foundCategory._id;
    } else {
      query.category = null;
    }
  }

  // FETCH ARTICLES + TRENDING IN PARALLEL
  const [articles, trendingArticles] = await Promise.all([
    Article.find(query)
      .populate("author", "firstName surname avatar")
      .populate("category", "name slug")
      .sort({
        createdAt: -1,
      })
      .lean(),

    Article.find({
      status: "Published",
      deletedAt: {
        $exists: false,
      },
    })
      .populate("author", "firstName surname avatar")
      .populate("category", "name slug")
      .sort({
        likes: -1,
        createdAt: -1,
      })
      .limit(3)
      .lean(),
  ]);

  // EMPTY STATE
  if (articles.length === 0) {
    return (
      <div className="min-h-screen py-32 flex flex-col items-center justify-center bg-cream-50 text-center px-4">
        <h2 className="text-4xl font-serif font-bold text-emerald-950 mb-4">
          The Library is Quiet...
        </h2>

        <p className="text-emerald-950/60 font-bold mb-12 max-w-md italic uppercase tracking-widest text-xs">
          Currently, no masterpieces have been published.
        </p>
      </div>
    );
  }

  const serializedArticles: PublicArticle[] = JSON.parse(
    JSON.stringify(articles),
  );

  const serializedTrending: PublicArticle[] = JSON.parse(
    JSON.stringify(trendingArticles),
  );

  return (
    <div className="font-sans">
      <main className="container mx-auto px-4 py-12 md:py-8">
        {/* HERO */}

        {!category && articles.length > 0 && (
          <div className="mb-24 md:mb-32">
            <Hero articles={serializedArticles.slice(0, 3)} />
          </div>
        )}

        {/* CONTENT */}

        <div className="flex flex-col lg:flex-row gap-15 xl:gap-20">
          {/* MAIN */}

          <div className="lg:w-2/3">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-6">
              <div>
                <h2 className="text-4xl font-serif font-bold text-emerald-950 mb-2">
                  {category ? `${category} Collection` : "Latest Masterpieces"}
                </h2>

                <div className="h-1.5 w-20 bg-emerald-950 rounded-full" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 xl:gap-12">
              {serializedArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </div>

          {/* SIDEBAR */}

          <div className="lg:w-1/3">
            <Sidebar trendingArticles={serializedTrending} />
          </div>
        </div>
      </main>
    </div>
  );
}
