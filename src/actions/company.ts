"use server";

import { cookies } from "next/headers";
import { CreateCompanyInput } from "@/lib/validation/company";

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access-token")?.value;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function createCompanyAction(data: CreateCompanyInput) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/companies`, {
      method: "POST",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to create company" };
    }

    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}

