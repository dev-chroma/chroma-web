import { Schema, model, models, Document, Types } from "mongoose";

export type NotificationType =
  | "General"
  | "Approval"
  | "Rejection"
  | "Role"
  | "Profile"
  | "Article"
  | "System"
  | "Warning";

export interface INotification extends Document {
  title: string;
  message: string;
  type: NotificationType;
  createdBy: Types.ObjectId;
  recipients: Types.ObjectId[];
  readBy: Types.ObjectId[];
  isGlobal: boolean;
}

const notificationTypes: NotificationType[] = [
  "General",
  "Approval",
  "Rejection",
  "Role",
  "Profile",
  "Article",
  "System",
  "Warning",
];

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
      enum: notificationTypes,
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

if (models.Notification) {
  models.Notification.schema.path("type").enum(...notificationTypes);
}

const Notification =
  models.Notification ||
  model<INotification>("Notification", NotificationSchema);

export default Notification;
