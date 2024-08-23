import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');

  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token.value, secret) as any;

    // Vérifier si le token a expiré
    if (Date.now() >= decoded.exp * 1000) {
      throw new Error('Token expired');
    }
    return NextResponse.json({ 
      user: { 
        id: decoded.id, 
        email: decoded.email, 
        profil: { 
          nom: decoded.role,
          roles: decoded.roles || []
        } 
      } 
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}