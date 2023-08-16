import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { permit } from "./app/api/authorizer";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/api/account/dashboard/health-benefits"],
  afterAuth: async ({ userId, session, isPublicRoute, ...auth }, { url }) => {
    // handle users who aren't authenticated
    if (!userId && !isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: url });
    }

    const { project_id, environment_id } = await fetch('https://api.permit.io/v2/api-key/scope', {
      headers: {
        'Authorization': `Bearer ${process.env.PERMIT_SDK_KEY}`,
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());

    const user = await fetch(`https://api.permit.io/v2/facts/${project_id}/${environment_id}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PERMIT_SDK_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    console.log('url', url);

    const { pathname, protocol, host } = new URL(url);

    if (user.status === 200 && pathname.indexOf('/welcome') === -1) {
      return;
    }

    if (user.status === 200 && pathname.indexOf('/welcome') >= 0) {
      return NextResponse.redirect(`${protocol}//${host}`);
    }

    if (pathname.indexOf('/welcome') >= 0) {
      return;
    }

    if (!isPublicRoute) {
      return NextResponse.redirect(`${protocol}//${host}/welcome`);
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
