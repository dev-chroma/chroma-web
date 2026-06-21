import Notification from "@/models/Notification";
import type { NotificationType } from "@/models/Notification";

interface CreateNotificationProps {
  title: string;
  message: string;
  createdBy: string;
  recipients?: string[];
  isGlobal?: boolean;
  type?: NotificationType;
}

export async function createNotification({
  title,
  message,
  createdBy,
  recipients = [],
  isGlobal = false,
  type = "General",
}: CreateNotificationProps) {
  return Notification.create({
    title,
    message,
    createdBy,
    recipients,
    isGlobal,
    type,
    readBy: [],
  });
}
