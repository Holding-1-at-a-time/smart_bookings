/**
 * @description      : Clerk Next.js middleware with Convex integration
 * @author           : rrome
 * @group            : 
 * @created          : 24/02/2025 - 00:20:16
 * 
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 24/02/2025
 * - Author          : rrome
 * - Modification    : 
 */
import { NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { ClerkMiddlewareOptions, createRouteMatcher } from "@clerk/nextjs/server"
import { toast } from "./hooks/use-toast";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)", "/api(.*)", "/booking(.*)"])

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)", "/org-selection"])

export default function clerkMiddleware(options: ClerkMiddlewareOptions) {
  return async ( req, auth ) => {
    // Check if the user is authenticated for protected routes
    if (isProtectedRoute(req) && !auth.userId) {
      const signInUrl = new URL("/sign-in", req.url)
      signInUrl.searchParams.set("redirect_url", req.url)
      return NextResponse.redirect(signInUrl)
    }

    // Redirect to org selection if authenticated but no active organization
    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/org-selection") {
      const orgSelection = new URL("/org-selection", req.url)
      return NextResponse.redirect(orgSelection)
    }

    // Fetch user data and permissions if authenticated
    if (auth.userId) {
      const user = await auth.users.getUser(auth.userId)
      const orgPermissions = auth.orgId
        ? await auth.organizations.getOrganizationMembershipPublicMetadata(auth.orgId, auth.userId)
        : null

      // Add user data and permissions to the request headers
      req.headers.set("X-User-Id", auth.userId)
      req.headers.set("X-User-Email", user.emailAddresses[0].emailAddress)
      req.headers.set("X-User-Name", `${user.firstName} ${user.lastName}`)
      if (orgPermissions) {
        req.headers.set("X-Org-Permissions", JSON.stringify(orgPermissions))
      }

      // Update Convex with user information
      try {
        await convex.mutation(api.users.updateUserInfo,
          {
            userId: auth.userId, // Add userId back to the mutation arguments
            email: user.emailAddresses[0].emailAddress,
            name: `${user.firstName} ${user.lastName}`,
            orgId: auth.orgId,
            orgPermissions: orgPermissions,
          }
        )
      }
      catch (error) {
        console.error("Failed to update user info in Convex:", error)
        toast({
          title: "Error updating user info",
          description: "Failed to update user info in Convex",
          variant: "destructive",
        })
      }
    }
    // Implement organization-specific data isolation
    if (auth.orgId) {
      req.headers.set("X-Organization-Id", auth.orgId)

      // Update Convex queries to include organization ID
      const originalUrl = new URL(req.url)
      if (originalUrl.pathname.startsWith("/api/convex")) {
        const convexUrl = new URL(originalUrl)
        convexUrl.searchParams.set("organizationId", auth.orgId)
        req.headers.set("x-convex-url", convexUrl.toString())
      }
    }

    // Continue to the next middleware or to the destination
    return NextResponse.next({
      request: {
        headers: req.headers,
      },
    })
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}

