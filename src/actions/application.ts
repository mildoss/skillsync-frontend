"use server";

import { getAuthHeaders } from "@/lib/server-utils";
import { revalidatePath } from "next/cache";
import { ApplicationStatus } from "@/types/application";

export async function applyForVacancyAction(vacancyId: string, coverLetter?: string) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/applications`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ vacancyId, coverLetter }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to apply" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}

export async function inviteCandidateAction(
  applicantId: string,
  vacancyId: string,
  message: string,
) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/applications/invite`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ applicantId, vacancyId, message }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to invite candidate" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}

export async function updateApplicationStatusAction(applicationId: string, status: ApplicationStatus) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/applications/${applicationId}/status`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to update status" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}