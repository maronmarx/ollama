import bcrypt from 'bcryptjs';
import fs from 'fs';
import { NextResponse } from 'next/server';

interface User {
  id: number;
  nom: string;
  email: string;
  password: string;
  profil?: {
    nom?: string;
    roles?: string[];
  };
  trialStartDate: string;
  trialEndDate: string;
  isTrialActive: boolean;
}

function addNotification(message: string) {
  const apiPath = '/app/config.json'
  const data = JSON.parse(fs.readFileSync(apiPath, 'utf8'));
  
  if (!data.notifications) {
    data.notifications = [];
  }
  
  data.notifications.push({
    id: Date.now(),
    message,
    createdAt: new Date().toISOString(),
    read: false
  });
  
  fs.writeFileSync(apiPath, JSON.stringify(data, null, 2));
}

export async function POST(request: Request) {
  try {
    const { nom, email, password } = await request.json();
    const apiPath = '/app/config.json'
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf8'));

    // Check if user already exists
    const existingUser = data.users.find((user: User) => user.email === email);
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'User already exists' }, { status: 400 });
    }

    const newId = Math.max(...data.users.map((user: User) => user.id)) + 1;
    const hashedPassword = await bcrypt.hash(password, 10);

    const trialDuration = 30; // Trial period in days
    const trialStartDate = new Date();
    const trialEndDate = new Date(trialStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + trialDuration);

    const newUser: User = {
      id: newId,
      nom,
      email,
      password: hashedPassword,
      profil: { nom: 'user', roles: ['basic_user'] },
      trialStartDate: trialStartDate.toISOString(),
      trialEndDate: trialEndDate.toISOString(),
      isTrialActive: true
    };

    data.users.push(newUser);
    fs.writeFileSync(apiPath, JSON.stringify(data, null, 2));
    
    addNotification(`New user registered: ${email}`);

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json({ success: true, message: 'User registered successfully', user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error("Error during user registration:", error);
    return NextResponse.json(
      { success: false, message: "Error during user registration" },
      { status: 500 }
    );
  }
}