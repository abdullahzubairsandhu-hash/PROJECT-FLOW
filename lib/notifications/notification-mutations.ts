// lib/notifications/notification-mutations.ts

"use server";

import { prisma } from "@/lib/prisma";

export async function createNotification(data: {
  userId: string;
  type: string;
  entityId: string;
  message: string;
}) {
  const notification = await prisma.notification.create({
    data,
  });

  // ROOM FOR SCALABILITY: 
  // if (process.env.ENABLE_LIVE_NOTIFS) {
  //   await pusher.trigger(`user-${data.userId}`, 'new-notif', notification);
  // }

  return notification;
}

export async function markNotificationAsRead(notificationId: string) {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
} 