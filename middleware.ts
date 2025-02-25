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
import { ConvexHttpClient } from "convex/browser"
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { toast } from "./hooks/use-toast";
import { api } from "./convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)", "/admin(.*)", "/api(.*)", "/booking(.*)"])



export default clerkMiddleware()
return async (req, auth) => {
  // Check if the user is authenticated for protected routes
  if (isProtectedRoute(req) && !auth.userId) {
    const signInUrl = new URL(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
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
          organizationPermissions: orgPermissions,
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

    // Continue to the next middleware or to the destination

  }
}