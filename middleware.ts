/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 19/02/2025 - 04:47:01
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 19/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { RedirectToSignIn } from "@clerk/clerk-react";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware({
  publicRoutes: ["/", "/auth/sign-in", "/auth/sign-up"],
  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      return RedirectToSignIn({ returnBackUrl: req.url });
    }
    if (auth.userId && !auth.orgId && req.nextUrl.pathname.startsWith("/dashboard")) {
      const orgSelection = new URL("/organizations", req.url);
      return NextResponse.redirect(orgSelection);
    }
  },
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
