import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public APIs ya routes jo authentication ke bagair chalne chahiyein
const isPublicRoute = createRouteMatcher([
  '/',
  '/cart',
  '/api/coupons(.*)', // Yeh line public kar degi taake cart coupon error na de
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};