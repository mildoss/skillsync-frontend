"use server";

import { revalidatePath } from "next/cache";
import { UpdateApplicantProfileInput, UpdateEmployerProfileInput } from "@/lib/validation/user";
import { getAuthHeaders } from "@/lib/server-utils";

export async function updateUserAction(data: UpdateEmployerProfileInput | UpdateApplicantProfileInput) {
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

export async function uploadMediaAction(formData: FormData) {
  try {
    const authHeaders = await getAuthHeaders();

    const { ["Content-Type"]: _, ...headers } = authHeaders;

    const res = await fetch(`${process.env.BACKEND_URL}/media/upload-avatar`, {
      method: "POST",
      headers,
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Error uploading file" };
    }

    const data = await res.json();
    return { url: data.url };
  } catch {
    return { error: "Upload error" };
  }
}