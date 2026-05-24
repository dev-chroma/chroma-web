import { Schema, model, Document, Types, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  firstName: string;
  surname: string;
  email: string;
  password: string;
  role: "Admin" | "Editor" | "Author";
  school: string;
  bio?: string;
  dateOfBirth: Date;
  avatar?: string;
  bookmarks: Types.ObjectId[];
  likedArticles: Types.ObjectId[];
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Editor", "Author"],
      default: "Author",
    },
    school: { type: String, required: true },
    bio: { type: String },
    dateOfBirth: {
      type: Date,
      required: true,
      validate: {
        validator: function (value: Date): boolean {
          const doc = this as HydratedDocument<IUser>;
          if (doc.role === "Author") {
            const ageDifMs = Date.now() - value.getTime();
            const ageDate = new Date(ageDifMs);
            const age = Math.abs(ageDate.getUTCFullYear() - 1970);
            return age < 18;
          }
          return true;
        },
        message: "Authors must be under 18 years of age.",
      },
    },
    avatar: { type: String },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: "Article" }],
    likedArticles: [{ type: Schema.Types.ObjectId, ref: "Article" }],
  },
  { timestamps: true },
);

userSchema.pre<IUser>("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default model<IUser>("User", userSchema);
