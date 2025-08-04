import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes and public paths
const protectedRoutes = ["/admin"];
const authRoutes = ["/admin/login"];
const publicPaths = [
  "/",
  "/hizmetlerimiz",
  "/kurye-basvuru",
  "/kurye-cagir",
  "/kurye-hizmeti-al",
];

// Rate limiting map (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Clean up rate limit entries
const cleanupRateLimit = () => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
};

// Check rate limit
const checkRateLimit = (
  ip: string,
  limit: number = 150, // More generous for general use
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const key = `${ip}:general`;
  const current = rateLimitMap.get(key);

  if (!current || now > current.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (current.count >= limit) {
    return true;
  }

  current.count++;
  return false;
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userAgent = request.headers.get("user-agent") || "";
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";

  // Clean up rate limit periodically
  if (Math.random() < 0.01) {
    // 1% chance
    cleanupRateLimit();
  }

  // Block suspicious user agents
  const suspiciousAgents = [
    "bot",
    "crawler",
    "spider",
    "scraper",
    "wget",
    "curl",
    "python-requests",
  ];

  const isSuspicious = suspiciousAgents.some((agent) =>
    userAgent.toLowerCase().includes(agent)
  );

  // Allow legitimate bots for SEO but block suspicious ones on admin routes
  if (isSuspicious && pathname.startsWith("/admin")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Rate limiting for admin routes
  if (pathname.startsWith("/admin")) {
    if (checkRateLimit(ip, 30, 60000)) {
      // 30 requests per minute for admin (stricter)
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": "60",
        },
      });
    }
  }

  // General rate limiting
  if (checkRateLimit(ip, 150, 60000)) {
    // 150 requests per minute general (generous for normal usage)
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": "60",
      },
    });
  }

  // Get token from cookies or headers
  const token =
    request.cookies.get("token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname.startsWith(route) && pathname !== "/admin/login"
  );

  // Check if current path is auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to admin if accessing login with valid token
  if (isAuthRoute && token) {
    const from = request.nextUrl.searchParams.get("from");
    const redirectUrl = from && from.startsWith("/admin") ? from : "/admin";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  // Create response with security headers
  const response = NextResponse.next();

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "off");

  // HSTS for HTTPS
  if (request.nextUrl.protocol === "https:") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://www.google-analytics.com",
    "frame-ancestors 'none'",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);

  // Admin specific headers
  if (pathname.startsWith("/admin")) {
    response.headers.set("X-Admin-Route", "true");
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
  }

  // Add cache headers for static assets
  if (
    pathname.startsWith("/_next/static/") ||
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)
  ) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
