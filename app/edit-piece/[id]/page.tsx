import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";

import "@/models/User";
import "@/models/Category";

import Article from "@/models/Article";
import Category from "@/models/Category";
import ArticleEditorForm from "@/components/editor/ArticleEditorForm";

interface EditPiecePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPiecePage({ params }: EditPiecePageProps) {
  await connectDB();
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth");
  }

  const { id } = await params;
  const [article, categories] = await Promise.all([
    Article.findById(id)
      .populate("author", "firstName surname role")
      .populate("category", "_id name")
      .lean(),
    Category.find()
      .sort({
        createdAt: -1,
      })
      .lean(),
  ]);

  if (!article) {
    redirect("/dashboard");
  }
  const isAuthor = article.author._id.toString() === user._id;
  const isAdmin = user.role === "Admin" || user.role === "Editor";
  if (!isAuthor && !isAdmin) {
    redirect("/dashboard");
  }

  const serializedArticle = JSON.parse(JSON.stringify(article));
  const serializedCategories = JSON.parse(JSON.stringify(categories));

  return (
    <ArticleEditorForm
      article={serializedArticle}
      categories={serializedCategories}
      isEdit
    />
  );
}
