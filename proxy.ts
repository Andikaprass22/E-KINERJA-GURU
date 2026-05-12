import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const protectedRoutes = ["/admin", "/principal", "/teacher", "/profile"];

const allowedOrigins = [
  process.env.BETTER_AUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean) as string[];

const corsHeaders = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const origin = req.headers.get("origin") ?? "";
  const isAllowedOrigin = allowedOrigins.includes(origin);

  if (req.method === "OPTIONS" && path.startsWith("/api/")) {
    return NextResponse.json(
      {},
      {
        headers: {
          ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
          ...corsHeaders,
        },
      },
    );
  }

  const isProtectedRoute = protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );

  if (isProtectedRoute) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  if (path === "/login") {
    const session = await auth.api.getSession({ headers: req.headers });
    if (session) {
      const role = session.user.role;
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
      } else if (role === "PRINCIPAL") {
        return NextResponse.redirect(new URL("/principal", req.nextUrl));
      } else {
        return NextResponse.redirect(new URL("/teacher", req.nextUrl));
      }
    }
  }

  if (path.startsWith("/admin/")) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/teacher", req.nextUrl));
    }
  }

  if (path.startsWith("/principal/")) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    if (session.user.role !== "PRINCIPAL" && session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/teacher", req.nextUrl));
    }
  }

  if (path.startsWith("/teacher/")) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  }

  const response = NextResponse.next();

  if (path.startsWith("/api/") && isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
