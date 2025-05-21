import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Check if the path is /upload
  const isUploadPage = path === "/upload"

  // Check if the user is authenticated
  const isAuthenticated = request.cookies.has("authenticated")

  // If the user is trying to access /upload without being authenticated,
  // redirect them to the sign-in page
  if (isUploadPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/upload/:path*"],
}
