"use server";

import { LoginInput, RegisterInput } from "@/lib/validation/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Tokens = {
  "access-token"?: string;
  "refresh-token"?: string;
};

async function setAuthCookies(data: Tokens) {
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
}

export async function registerAction(values: RegisterInput) {
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

    await setAuthCookies(data);
  } catch (error) {
    console.log(error);
    return { error: "Server error" };
  }
  redirect("/");
}

export async function loginAction(values: LoginInput) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Login error" };
    }

    await setAuthCookies(data);
  } catch (error) {
    console.log(error);
    return { error: "Server error" };
  }
  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();

  cookieStore.delete("access-token");
  cookieStore.delete("refresh-token");

  redirect("/");
}