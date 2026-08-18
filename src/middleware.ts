import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define public routes (Jahan bina login kiye ja sakein)
const isPublicRoute = createRouteMatcher([
  "/",
  "/cart(.*)",       
  "/shop(.*)",       
  "/men(.*)",
  "/women(.*)",
  "/category(.*)",
  "/product(.*)",
  "/api/products(.*)",
  "/api/admin/payment(.*)",
  "/api/coupons(.*)",      
  "/sign-in(.*)",
  "/sign-up(.*)"
]);

// 2. Protect non-public routes (Jaise /checkout) automatically
export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?)).*)',
    '/(api|trpc)(.*)',
  ],
};