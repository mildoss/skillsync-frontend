"use server";

import { getAuthHeaders } from "@/lib/server-utils";
import { revalidatePath } from "next/cache";
import { NotificationResponse } from "@/types/notifications";

export async function getMyNotificationsAction(): Promise<NotificationResponse | null> {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/notifications`, {
      method: "GET",
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) return null;

    return await res.json();
  } catch {
    return null;
  }
}

export async function markNotificationsAsReadAction() {
  try {
    await fetch(`${process.env.BACKEND_URL}/notifications/read`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
    });

    revalidatePath("/", "layout");

    return { success: true };
  } catch {
    return { error: "Failed to mark as read" };
  }
}