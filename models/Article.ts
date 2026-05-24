import { Schema, model, Document, Types } from "mongoose";

export interface IArticle extends Document {
  title: string;
  excerpt?: string;
  content: string;
  author: Types.ObjectId;
  status: "Draft" | "Pending" | "Published";
  category: Types.ObjectId;
  thumbnail?: string;
  featuredImage?: string;
  tags: string[];
  readTime: string;
  likes: number;
  commentsCount: number;
  bookmarksCount: number;
  bookmarkedBy: string[];
  likedBy: string[];
  viewedBy: string[];
  reads: number;
  deletedAt?: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true },
    excerpt: { type: String },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["Draft", "Pending", "Published"],
      default: "Draft",
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    thumbnail: { type: String },
    featuredImage: { type: String }, // Keep for legacy
    tags: [{ type: String }],
    readTime: { type: String, default: "5 min" },
    likes: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    bookmarksCount: { type: Number, default: 0 },
    bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    viewedBy: {
      type: [String],
      default: [],
    },
    reads: { type: Number, default: 0 },
    deletedAt: { type: Date },
  },
  { timestamps: true },
);

// TTL Index for soft delete (7 days = 604800 seconds)
articleSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 604800 });

// Index for search
articleSchema.index({ title: "text", content: "text", tags: "text" });

export default model<IArticle>("Article", articleSchema);
