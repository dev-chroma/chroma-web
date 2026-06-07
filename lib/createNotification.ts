import Notification from "@/models/Notification";

interface CreateNotificationProps {
  title: string;
  message: string;
  recipients?: string[];
  isGlobal?: boolean;
  type?: "General" | "Approval" | "Rejection" | "Role" | "Profile" | "Article";
}

export async function createNotification({
  title,
  message,
  recipients = [],
  isGlobal = false,
  type = "General",
}: CreateNotificationProps) {
  return Notification.create({
    title,
    message,
    recipients,
    isGlobal,
    type,
    readBy: [],
  });
}
