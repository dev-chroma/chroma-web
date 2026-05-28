import { Schema, model, Document, models } from "mongoose";

export interface ITag extends Document {
  name: string;
}

const tagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const Tag = models.Tag || model<ITag>("Tag", tagSchema);
export default Tag;
