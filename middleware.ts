import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SUPPORTED_LOCALES = new Set(["ru", "ro", "en"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const segment = pathname.split("/").filter(Boolean)[0];
  const locale = segment && SUPPORTED_LOCALES.has(segment) ? segment : "ro";

  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);

  return NextResponse.next({
    request: { headers },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
