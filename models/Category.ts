import { Schema, model, Document, models } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const Category =
  models.Category || model<ICategory>("Category", categorySchema);
export default Category;
