import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   // 1. Obtenemos la cookie HttpOnly que guardó el backend al hacer login
//   const token = request.cookies.get("verdicienta_token")?.value;
//   const { pathname } = request.nextUrl;

//   // 2. Si el usuario intenta entrar a la zona de administración sin estar autenticado
//   if (pathname.startsWith("/admin")) {
//     if (!token) {
//       // Redirigir inmediatamente a la pantalla de login
//       const loginUrl = new URL("/login", request.url);
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   // 3. Si el usuario YA inició sesión e intenta ir al formulario de /login
//   if (pathname === "/login" && token) {
//     // Redirigir al inicio para evitar que vuelva a loguearse
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Permite que la petición continúe con normalidad
//   return NextResponse.next();
// }

export function middleware(request: NextRequest) {
  const token = request.cookies.get("verdicienta_token")?.value;
  const { pathname } = request.nextUrl;

  // Redirigir si no hay token al intentar entrar a /admin
  if (pathname.startsWith("/admin") && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirigir si YA hay token e intenta ir a /login
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configuración de rutas donde debe ejecutarse este middleware
export const config = {
  matcher: [
    "/admin/:path*", // Protege /admin y cualquier subruta como /admin/users
    "/login",        // Controla la ruta de login
  ],
};