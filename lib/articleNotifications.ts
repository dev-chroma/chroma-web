import type { Document, Types } from "mongoose";

import { createNotification } from "@/lib/createNotification";

type ArticleAuthor = {
  _id?: string | Types.ObjectId;
  firstName?: string;
  surname?: string;
};

type ArticleAuthorLike = string | Types.ObjectId | ArticleAuthor;

type ArticleAudienceSource = {
  title: string;
  author?: ArticleAuthorLike;
  enrolledBy?: ArticleAuthorLike[];
} & Document;

const toId = (value: ArticleAuthorLike | undefined | null) => {
  if (!value) {
    return "";
  }

  if (isPopulatedArticleAuthor(value)) {
    return value._id ? value._id.toString() : "";
  }

  return value.toString();
};

const isPopulatedArticleAuthor = (
  author: ArticleAuthorLike | undefined | null,
): author is ArticleAuthor => {
  return (
    !!author &&
    typeof author === "object" &&
    ("firstName" in (author as Record<string, unknown>) ||
      "surname" in (author as Record<string, unknown>))
  );
};

export const getArticleAuthorName = (article: ArticleAudienceSource) => {
  const author = article.author;

  if (isPopulatedArticleAuthor(author)) {
    const firstName = author.firstName?.trim() || "";
    const surname = author.surname?.trim() || "";
    const fullName = `${firstName} ${surname}`.trim();

    if (fullName) {
      return fullName;
    }
  }

  return "the author";
};

export const getArticleRecipients = (
  article: ArticleAudienceSource,
  excludeIds: Array<string | Types.ObjectId> = [],
) => {
  const excluded = new Set(excludeIds.map(toId).filter(Boolean));
  const fallbackRecipients = article.author ? [article.author] : [];
  const recipients = (article.enrolledBy?.length ? article.enrolledBy : fallbackRecipients)
    .map(toId)
    .filter((id) => id && !excluded.has(id));

  return Array.from(new Set(recipients));
};

interface NotifyArticleAudienceProps {
  article: ArticleAudienceSource;
  createdBy: string;
  title: string;
  message: string;
  type?:
    | "General"
    | "Approval"
    | "Rejection"
    | "Role"
    | "Profile"
    | "Article"
    | "System"
    | "Warning";
  isGlobal?: boolean;
  excludeRecipients?: Array<string | Types.ObjectId>;
}

export async function notifyArticleAudience({
  article,
  createdBy,
  title,
  message,
  type = "Article",
  isGlobal = false,
  excludeRecipients = [],
}: NotifyArticleAudienceProps) {
  const recipients = getArticleRecipients(article, excludeRecipients);

  if (!isGlobal && recipients.length === 0) {
    return null;
  }

  return createNotification({
    title,
    message,
    createdBy,
    recipients,
    isGlobal,
    type,
  });
}
