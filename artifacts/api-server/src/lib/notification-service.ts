import { db, notificationsTable, notificationDeliveriesTable, userDevicesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const EXPO_URL = "https://exp.host/--/api/v2/push/send";
const timeoutMs = 8000;

export type NotificationEvent = {
  appId: "web" | "geeta_nexus" | "nexus_plus";
  title: string;
  body: string;
  data?: Record<string, unknown>;
  actionUrl?: string;
  audience?: { userIds?: number[]; pushTokens?: string[] };
};

function validExpoToken(token: string | null): token is string {
  return !!token && (/^ExponentPushToken\[.+\]$/.test(token) || /^ExpoPushToken\[.+\]$/.test(token));
}

export async function dispatchNotification(event: NotificationEvent) {
  const [notification] = await db.insert(notificationsTable).values({
    targetChannel: event.appId,
    title: event.title,
    message: event.body,
    actionUrl: event.actionUrl ?? null,
    broadcastType: "unified_event",
  }).returning();
  if (!notification) throw new Error("Notification was not created");

  const devices = await db.select().from(userDevicesTable).where(eq(userDevicesTable.appId, event.appId));
  const selected = devices.filter((device) => {
    if (!validExpoToken(device.pushToken)) return false;
    if (event.audience?.pushTokens?.length && !event.audience.pushTokens.includes(device.pushToken)) return false;
    if (event.audience?.userIds?.length && (!device.userId || !event.audience.userIds.includes(device.userId))) return false;
    return true;
  });
  if (!selected.length) return { notification, sent: 0, failed: 0 };

  const messages = selected.map((device) => ({ to: device.pushToken!, sound: "default", title: event.title, body: event.body, data: event.data ?? {}, ttl: 86400 }));
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.EXPO_ACCESS_TOKEN) headers.authorization = `Bearer ${process.env.EXPO_ACCESS_TOKEN}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(EXPO_URL, { method: "POST", headers, body: JSON.stringify(messages), signal: controller.signal });
    const payload = await response.json().catch(() => ({})) as { data?: Array<{ status?: string; id?: string; message?: string }> };
    const tickets = Array.isArray(payload.data) ? payload.data : [];
    await Promise.all(selected.map((device, index) => db.insert(notificationDeliveriesTable).values({
      notificationId: notification.id, userId: device.userId, appId: event.appId, provider: "expo", pushToken: device.pushToken, status: response.ok && tickets[index]?.status !== "error" ? "sent" : "failed", providerTicketId: tickets[index]?.id ?? null, error: tickets[index]?.message ?? (!response.ok ? `Expo returned ${response.status}` : null),
    })));
    return { notification, sent: response.ok ? tickets.filter((ticket: { status?: string }) => ticket.status !== "error").length : 0, failed: response.ok ? tickets.filter((ticket: { status?: string }) => ticket.status === "error").length : selected.length };
  } finally {
    clearTimeout(timer);
  }
}

export async function removeDeviceToken(token: string) {
  await db.delete(userDevicesTable).where(eq(userDevicesTable.pushToken, token));
}
