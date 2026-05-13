"use server";

import { PackageId } from "@/types/payments";
import { getAuthHeaders } from "@/lib/server-utils";

export async function createCheckoutSessionAction(packageId: PackageId) {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(`${process.env.BACKEND_URL}/payments/checkout`, {
      method: "POST",
      headers,
      body: JSON.stringify({ packageId }),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to analyze" };
    }

    const data = await res.json();

    if (!data || !data.checkoutUrl) {
      return { error: "Failed to retrieve checkout URL from the server." };
    }

    return { checkoutUrl: data.checkoutUrl };
  } catch {
    return { error: "Connection error" };
  }
}
