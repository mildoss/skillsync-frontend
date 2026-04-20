"use server";

import { RegisterInput } from "@/lib/validation/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerAction(values: RegisterInput) {
  let isSuccess = false;

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Registration error" };
    }

    const cookieStore = await cookies();

    if (data["refresh-token"]) {
      cookieStore.set("refresh-token", data["refresh-token"], {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    if (data["access-token"]) {
      cookieStore.set("access-token", data["access-token"], {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });
    }

    isSuccess = true;
  } catch (error) {
    console.log(error);
    return { error: "Server error" };
  }

  if (isSuccess) {
    redirect("/");
  }
}