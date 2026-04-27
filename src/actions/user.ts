"use server";

import { revalidatePath } from "next/cache";
import { UpdateEmployerProfileInput } from "@/lib/validation/user";
import { getAuthHeaders } from "@/lib/server-utils";

export async function updateUserAction(data: UpdateEmployerProfileInput) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/users/me`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to update profile" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}