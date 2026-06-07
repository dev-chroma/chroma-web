import NotificationList from "@/components/notifications/NotificationList";
import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";

import Notification from "@/models/Notification";


export default async function NotificationsPage() {
  await connectDB();

  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const notifications = await Notification.find({
    $or: [
      {
        isGlobal: true,
      },
      {
        recipients: user._id,
      },
    ],
  })
    .sort({
      createdAt: -1,
    })
    .lean();

  const serializedNotifications = JSON.parse(JSON.stringify(notifications));

  return (
    <main className="min-h-screen bg-cream-50 py-20">
      <div className="container mx-auto max-w-5xl px-4">
        <NotificationList
          notifications={serializedNotifications}
          userId={user._id}
        />
      </div>
    </main>
  );
}
