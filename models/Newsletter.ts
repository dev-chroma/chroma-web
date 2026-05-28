import { Schema, model, Document, models } from "mongoose";

export interface INewsletter extends Document {
  email: string;
}

const newsletterSchema = new Schema<INewsletter>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
  },
  { timestamps: true },
);

const Newsletter =
  models.Newsletter || model<INewsletter>("Newsletter", newsletterSchema);
export default Newsletter;
