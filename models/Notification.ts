// models/Notification.ts

import { Schema, model, models } from "mongoose";

export interface INotification extends Document {
  title: string;
  message: string;
  type: "General" | "Article" | "System" | "Warning";
  createdBy: Schema.Types.ObjectId;
  recipients: Schema.Types.ObjectId[];
  readBy: Schema.Types.ObjectId[];
  isGlobal: boolean;
}

const NotificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["General", "Article", "System", "Warning"],
      default: "General",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recipients: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    isGlobal: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Notification =
  models.Notification ||
  model<INotification>("Notification", NotificationSchema);

export default Notification;
