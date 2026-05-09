"use server";

import { AiDraftResponse, AiGenerationType } from "@/types/ai";
import { getAuthHeaders } from "@/lib/server-utils";

export const getLatestDraft = async (type: AiGenerationType) => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/ai/draft?type=${type}`, {
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      return { data: null };
    }

    const data: AiDraftResponse = await res.json();

    return { data };
  } catch {
    return { data: null, error: "Failed to fetch draft" };
  }
};
