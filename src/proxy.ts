import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

const authRoutes = ["/login", "/register"];
const privateRoutes = ["/profile", "/applications", "/company", "/my-vacancies", "/team"];

function isTokenExpiring(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const timeToLive = (payload.exp * 1000) - Date.now();
    return timeToLive < 5 * 60 * 1000;
  } catch {
    return true;
  }
}

async function fetchNewTokens(refreshToken: string) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh-token=${refreshToken}`,
      },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  let accessToken = request.cookies.get("access-token")?.value;
  const refreshToken = request.cookies.get("refresh-token")?.value;

  if (refreshToken && (!accessToken || isTokenExpiring(accessToken))) {
    const newTokens = await fetchNewTokens(refreshToken);

    if (newTokens) {
      const newAccessToken = newTokens["access-token"];

      response.cookies.set("access-token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 15 * 60,
      });

      accessToken = newAccessToken;
    } else {
      response.cookies.delete("access-token");
      response.cookies.delete("refresh-token");
    }
  }

  const isAuth = !!accessToken;
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  if (isAuth && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuth && isPrivateRoute) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}