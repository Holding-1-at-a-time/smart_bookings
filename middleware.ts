/**
    * @description      : 
    * @author           : rrome
    * @group            : 
    * @created          : 26/02/2025 - 09:19:24
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 26/02/2025
    * - Author          : rrome
    * - Modification    : 
**/
import { NextResponse } from "next/server"
import { clerkMiddleware, clerkClient } from "@clerk/nextjs/server"
import { updateUserInfo } from "./convex/auth"
import { verifyAuth } from "./lib/auth"

export default clerkMiddleware({
  async afterAuth(auth, req, evt) {
    const { userId, orgId } = auth
    const { pathname } = req.nextUrl

    // Handle authentication for protected routes
    if ((pathname.startsWith("/dashboard") ||
          pathname.startsWith("/admin") ||
          pathname.startsWith("/api") ||
          pathname.startsWith("/booking")) && !userId) {
          const signInUrl = new URL("/sign-in", req.url)
          signInUrl.searchParams.set("redirect_url", req.url)
          return NextResponse.redirect(signInUrl)
    }


    // Handle organization selection
    if (userId && !orgId && pathname !== "/org-selection") {
      return NextResponse.redirect(new URL("/org-selection", req.url))
    }

    // Role-based access control
    if (userId && orgId) {
      const user = await clerkClient.users.getUser(userId)
      const orgMembership = user.organizationMemberships.find((membership) => membership.organization.id === orgId)

      if (orgMembership) {
        const {role} = orgMembership

        if (pathname.startsWith("/admin") && role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        if (pathname.startsWith("/manager") && !["admin", "manager"].includes(role)) {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        if (pathname.startsWith("/detailer") && !["admin", "manager", "detailer"].includes(role)) {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }

        if (pathname.startsWith("/client") && role !== "client") {
          return NextResponse.redirect(new URL("/dashboard", req.url))
        }
      }
    }

    // Manual JWT verification
    const token = req.headers.get("Authorization")?.split(" ")[1]
    if (token) {
      const { isValid, payload } = await verifyAuth(token)
      if (!isValid) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 })
      }
      // You can use the payload for additional checks or to set custom headers
    }

    // Set headers
    const response = NextResponse.next()
    response.headers.set("X-User-Id", userId || "")
    response.headers.set("X-Organization-Id", orgId || "")

    // Update user info in Convex
    if (userId && orgId) {
      await updateUserInfoInConvex(userId, orgId)
    }

    return response
  },
})

async function updateUserInfoInConvex(userId: string, orgId: string) {
  const user = await clerkClient.users.getUser(userId)
  const orgMembership = user.organizationMemberships.find((membership) => membership.organization.id === orgId)

  if (user && orgMembership) {
    await updateUserInfo({
      userId,
      email: user.emailAddresses[0]?.emailAddress || "",
      name: `${user.firstName} ${user.lastName}`,
      orgId,
      orgPermissions: orgMembership.permissions,
    })
  }
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

