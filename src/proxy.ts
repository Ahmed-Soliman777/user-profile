import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = (await cookies()).get("token");
  if (
    token &&
    (pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/forget-password")
  ) {
    return NextResponse.redirect(new URL("/profile", request.url));
  } else if (!token && pathname === "profile") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/profile", "/login", "/register", "/forget-password"],
};
