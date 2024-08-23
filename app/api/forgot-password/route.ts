import bcrypt from 'bcryptjs';
import fs from 'fs';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const apiPath = path.join(process.cwd(), 'api.json');
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf-8'));
    const user = data.users.find((u: any) => u.email === email);

    if (!user) {
      return NextResponse.json({ success: false, message: "Utilisateur non trouvé" }, { status: 404 });
    }
    

    // Générer un nouveau mot de passe
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = hashedPassword;
    fs.writeFileSync(apiPath, JSON.stringify(data, null, 2));

    // Envoyer l'email
    const transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // Changé de smtp.gmail.com
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: '"Admin" <system-data-driven@outlook.com>', // 
        to: email,
        subject: "Réinitialisation de votre mot de passe",
        text: `Votre nouveau mot de passe est : ${newPassword}`,
        html: `<b>Votre nouveau mot de passe est : ${newPassword}</b>`,
      });

    return NextResponse.json({ success: true, message: "Email envoyé avec succès" });
  } catch (error) {
    console.error("Erreur détaillée lors de la réinitialisation du mot de passe:", error);
    return NextResponse.json({ success: false, message: "Erreur lors de la réinitialisation du mot de passe", error: error }, { status: 500 });
  }
}