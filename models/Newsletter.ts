import { Schema, model, Document } from "mongoose";

export interface INewsletter extends Document {
  email: string;
}

const newsletterSchema = new Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true },
);

export default model<INewsletter>("Newsletter", newsletterSchema);
