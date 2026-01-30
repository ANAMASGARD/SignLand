import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Only protect /translate - sign-in and sign-up should be public
const isProtectedRoute = createRouteMatcher([
  '/translate(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|task)).*)',
    '/(api|trpc)(.*)',
  ],
};
