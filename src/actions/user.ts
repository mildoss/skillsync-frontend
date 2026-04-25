"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { UpdateEmployerProfileInput } from "@/lib/validation/user";

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

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