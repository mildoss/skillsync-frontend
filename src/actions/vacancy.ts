"use server";

import { revalidatePath } from "next/cache";
import { getAuthHeaders } from "@/lib/server-utils";
import { VacancyInput } from "@/lib/validation/vacancy";

export async function createVacancyAction(data: VacancyInput) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/vacancies`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to create vacancy" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}

export async function updateVacancyAction(vacancyId: string, data: VacancyInput) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/vacancies/${vacancyId}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to update vacancy" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}

export async function deleteVacancyAction(vacancyId: string) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/vacancies/${vacancyId}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to delete vacancy" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}
