"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get("access-token")?.value || "";
}

export async function revalidate(path: string) {
  revalidatePath(`${path}`);
}