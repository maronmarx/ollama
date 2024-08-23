import bcrypt from 'bcryptjs';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const apiPath = '/app/config.json'
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf-8'));
    const user = data.users.find((u: any) => u.email === email);

    if (user && await bcrypt.compare(password, user.password)) {
      // Vérifier si la période d'essai est toujours active
      const now = new Date();
      const trialEnd = new Date(user.trialEndDate);
      const isTrialActive = now <= trialEnd;
      
      if (user.trialStartDate && user.trialEndDate) {
        const now = new Date();
        const trialEnd = new Date(user.trialEndDate);
        const isTrialActive = now <= trialEnd;
        
        if (user.isTrialActive !== isTrialActive) {
          user.isTrialActive = isTrialActive;
          // Mettre à jour le fichier JSON
          fs.writeFileSync(apiPath, JSON.stringify(data, null, 2));
        }
      } else {
        // Si la période d'essai n'est pas définie, considérez-la comme active
        user.isTrialActive = true;
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error('JWT_SECRET is not defined');
      }
      const token = jwt.sign(
        { 
          id: user.id, 
          email: user.email, 
          role: user.profil.nom, 
          roles: user.profil.roles,
          isTrialActive
        },
        secret,
        { expiresIn: '30m' }
      );

      const response = NextResponse.json({
        success: true,
        user: { 
          id: user.id, 
          email: user.email, 
          nom: user.nom, 
          profil: user.profil,
          isTrialActive
        }
      });

      cookies().set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        //le temps de la déconnexion 
        maxAge: 30 * 60, // 30 minutes en secondes
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json({
        success: false,
        message: "Email ou mot de passe incorrect"
      }, { status: 400 });
    }
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    return NextResponse.json({
      success: false,
      message: "Erreur lors de la connexion"
    }, { status: 500 });
  }
}
