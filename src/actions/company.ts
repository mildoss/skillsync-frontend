"use server";

import { CreateCompanyInput } from "@/lib/validation/company";
import { revalidatePath } from "next/cache";
import { getAuthHeaders } from "@/lib/server-utils";

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

export async function getCompanyRequestsAction(companyId: string) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/companies/${companyId}/requests`, {
      method: "GET",
      headers: await getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) return { error: "Failed to fetch requests" };

    const data = await res.json();
    return { data };
  } catch {
    return { error: "Server connection failed" };
  }
}

export async function handleJoinRequestAction(
  companyId: string,
  requestId: string,
  status: "APPROVED" | "REJECTED",
) {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/companies/${companyId}/requests/${requestId}`,
      {
        method: "PATCH",
        headers: await getAuthHeaders(),
        body: JSON.stringify({ status }),
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to process request" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}

export async function removeEmployeeAction(companyId: string, employeeId: string) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/companies/${companyId}/employees/${employeeId}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to remove employee" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}

export async function joinCompanyAction(companyId: string) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/companies/${companyId}/join`, {
      method: "POST",
      headers: await getAuthHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json();
      if (res.status === 409) {
        return { success: true, alreadySent: true };
      }
      return { error: errorData.message || "Failed to send request" };
    }
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}

export async function getMyRequestsAction() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/companies/requests/me`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!res.ok) return { error: "Failed to fetch requests" };

    const data = await res.json();
    return { data };
  } catch {
    return { error: "Server connection failed" };
  }
}

export async function cancelJoinRequestAction(requestId: string) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/companies/requests/${requestId}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });

    if (!res.ok) return { error: "Failed to cancel request" };
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}

export async function searchCompaniesAction(query: string) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/companies?search=${query}&limit=5`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (!res.ok) {
      return { error: "Failed to search companies" };
    }

    const result = await res.json();

    return { data: result.data };
  } catch {
    return { error: "Server connection failed" };
  }
}

export async function updateCompanyAction(id: string, data: CreateCompanyInput) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/companies/${id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to update company" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}

export async function deleteCompanyAction(companyId: string) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/companies/${companyId}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to delete company" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}

export async function leaveCompanyAction() {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/companies/leave`, {
      method: "POST",
      headers: await getAuthHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { error: errorData.message || "Failed to leave company" };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "Server connection failed" };
  }
}