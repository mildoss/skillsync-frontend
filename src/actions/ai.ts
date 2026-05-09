"use server";

import { getAuthHeaders } from "@/lib/server-utils";
import { AiGenerationResponse} from "@/types/ai";
import { getVacancy } from "@/lib/api";
import { getMe } from "@/lib/server-api";

export async function generateCoverLetterAction(vacancyId: string) {
  try {
    const headers = await getAuthHeaders();

    const vacancy = await getVacancy(vacancyId);

    const user = await getMe();
    if (!user) return { error: "Failed to fetch user profile" };

    const aiRes = await fetch(`${process.env.BACKEND_URL}/ai/cover-letter`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        vacancyTitle: vacancy.title,
        vacancyDescription: vacancy.description,
        candidateAbout: user.about || "",
        candidateSkills: user.skills?.map((s) => s.name) || [],
        candidateExperience: user.experience ? `${user.experience} years` : "",
      }),
    });

    if (!aiRes.ok) {
      const errorData = await aiRes.json();
      return { error: errorData.message || "Failed to generate Cover Letter" };
    }

    const data: AiGenerationResponse = await aiRes.json();
    return { data };
  } catch {
    return { error: "Server connection failed" };
  }
}

export async function generateVacancyDescriptionAction(jobTitle: string, keywords: string[]) {
  try {
    const aiRes = await fetch(`${process.env.BACKEND_URL}/ai/vacancy`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        jobTitle,
        keywords,
      }),
    });

    if (!aiRes.ok) {
      const errorData = await aiRes.json();
      return { error: errorData.message || "Failed to generate Job Description" };
    }

    const data: AiGenerationResponse = await aiRes.json();
    return { data };
  } catch {
    return { error: "Server connection failed" };
  }
}
