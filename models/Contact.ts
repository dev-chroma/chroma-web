import { Schema, model, Document, models } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
);

const Contact = models.Contact || model<IContact>("Contact", contactSchema);
export default Contact;
