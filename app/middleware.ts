import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log('Middleware called for path:', request.nextUrl.pathname);
  const token = request.cookies.get('auth_token')?.value;
  console.log('Token found:', !!token);
  
  if (request.nextUrl.pathname === '/users' || request.nextUrl.pathname === '/chate') {
    if (!token) {
      console.log('No token, redirecting to login');
      return NextResponse.redirect(new URL(`/?redirect=${request.nextUrl.pathname}`, request.url));
    }
    
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/check-auth`, {
        headers: {
          'Cookie': `auth_token=${token}`
        }
      });
      
      console.log('Check-auth response status:', response.status);
      
      if (!response.ok) {
        throw new Error('Failed to check authentication');
      }
      
      const data = await response.json();
      console.log('User role:', data.user?.profil?.nom);
      
      if (request.nextUrl.pathname === '/users' && data.user?.profil?.nom !== 'admin') {
        console.log('User is not admin, redirecting to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      if (request.nextUrl.pathname === '/chate' && data.user?.profil?.nom === 'admin') {
        console.log('User is admin, redirecting to users');
        return NextResponse.redirect(new URL('/users', request.url));
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
      //verification de la deconnexion 
      try {
        const response = await fetch(`${request.nextUrl.origin}/api/check-auth`, {
          headers: {
            'Cookie': `auth_token=${token}`
          }
        });
        
        if (!response.ok) {
          // Vérification des comptes actif avant de rediriger
          const lastActivityTime = request.cookies.get('lastActivityTime')?.value;
          const currentTime = new Date().getTime();

          //le temps de la déconnexion 
          if (!lastActivityTime || currentTime - parseInt(lastActivityTime) > 10 * 60 * 1000) {
            console.log('Token expired or invalid, and user inactive, redirecting to login');
            return NextResponse.redirect(new URL(`/?redirect=${request.nextUrl.pathname}`, request.url));
          } else {
            // L'utilisateur est actif, mais le token est expiré. Rafraîchissez le token ici 
            console.log('Token expired but user is active. Refreshing token...');
            
          }
        }
        
        
      } catch (error) {
        console.error('Error checking authentication:', error);
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.next();
    }
  
  


export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};