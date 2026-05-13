import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    role: string[];
    exp: number;
}

const publicRoutes = ['/login'];

const adminOnlyRoutes: string[] = ['/users'];

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/login";
const REDIRECT_WHEN_NOT_AUTHORIZED = "/";

function isTokenExpired(token: string): boolean {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch {
        return true;
    }
}

export default function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isPublicRoute = publicRoutes.includes(path);
    const accessToken = request.cookies.get("access_token")?.value;

    if ((!accessToken || isTokenExpired(accessToken)) && !isPublicRoute) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
        return NextResponse.redirect(redirectUrl);
    }

    if (accessToken && !isTokenExpired(accessToken) && isPublicRoute) {
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = "/";
        return NextResponse.redirect(redirectUrl);
    }

    if (accessToken && !isTokenExpired(accessToken) && !isPublicRoute) {
        try {
            const decoded = jwtDecode<JwtPayload>(accessToken);
            const roles = decoded.role || [];
            const isAdmin = roles.includes('ADMIN');

            const isAdminOnly = adminOnlyRoutes.some(route => path.startsWith(route));

            if (isAdminOnly && !isAdmin) {
                const redirectUrl = request.nextUrl.clone();
                redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHORIZED;
                return NextResponse.redirect(redirectUrl);
            }
        } catch {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
            return NextResponse.redirect(redirectUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};