import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET;

  const token = await getToken({
    req: request,
    secret: secret,
  });

  const isAuthenticated = !!token;
  const userRole = token?.role;
  const allowedRoles = [10, 40, 50];

  const isAuthPage = pathname === "/auth/signin";

  if (isAuthenticated) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (!allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    return NextResponse.next();
  }

  if (!isAuthenticated) {
    if (!isAuthPage) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
