import { Schema, model, Document } from "mongoose";

export interface ITag extends Document {
  name: string;
}

const tagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export default model<ITag>("Tag", tagSchema);
