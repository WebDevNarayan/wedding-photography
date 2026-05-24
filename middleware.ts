import { auth } from "@/lib/auth";

export default auth((req) => {
  const isLoginPage = req.nextUrl.pathname === "/admin/login";
  if (!req.auth && !isLoginPage) {
    return Response.redirect(new URL("/admin/login", req.url));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
