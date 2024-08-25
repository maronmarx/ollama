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
//Notifications methodes 
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

// GET: Récupérer tous les utilisateurs
export async function GET() {
  try {
    const apiPath = '/app/config.json'
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf8'));
    
    // Supprimer les mots de passe des données renvoyées
    const usersWithoutPasswords = data.users.map((user: User) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return NextResponse.json({ users: usersWithoutPasswords });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return NextResponse.json({
      success: false,
      message: "Erreur lors de la récupération des utilisateurs"
    }, { status: 500 });
  }
}

// POST: Ajouter un nouvel utilisateur
export async function POST(request: Request) {
  try {
    const newUser = await request.json() as Omit<User, 'id' | 'trialStartDate' | 'trialEndDate' | 'isTrialActive'>;
    const apiPath = '/app/config.json'
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf8'));

    const newId = Math.max(...data.users.map((user: User) => user.id)) + 1;
    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    const trialDuration = 30; // Durée de la période d'essai en jours
    const trialStartDate = new Date();
    const trialEndDate = new Date(trialStartDate);
    trialEndDate.setDate(trialEndDate.getDate() + trialDuration);

    const userToAdd: User = {
      id: newId,
      ...newUser,
      password: hashedPassword,
      profil: newUser.profil || { nom: '', roles: [] },
      trialStartDate: trialStartDate.toISOString(),
      trialEndDate: trialEndDate.toISOString(),
      isTrialActive: true
    };
    data.users.push(userToAdd);

    fs.writeFileSync(apiPath, JSON.stringify(data, null, 2));
    
    //appel de la methodes des notifications 
    addNotification(`Nouvel utilisateur créé : ${newUser.email}`);

    const { password, ...userWithoutPassword } = userToAdd;
    return NextResponse.json({ message: 'Utilisateur ajouté avec succès', user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur:", error);
    return NextResponse.json(
      { message: "Erreur lors de l'ajout de l'utilisateur" },
      { status: 500 }
    );
  }
}

// PUT: Mettre à jour un utilisateur existant
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const updatedUser = await request.json();

    const apiPath = '/app/config.json'
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf8'));

    const userIndex = data.users.findIndex((user: User) => user.id.toString() === id);

    if (userIndex === -1) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Mettre à jour l'utilisateur
    data.users[userIndex] = { 
      ...data.users[userIndex], 
      ...updatedUser,
      profil: updatedUser.profil || data.users[userIndex].profil || { nom: '', roles: [] },
      trialStartDate: updatedUser.trialStartDate || data.users[userIndex].trialStartDate,
      trialEndDate: updatedUser.trialEndDate || data.users[userIndex].trialEndDate,
      isTrialActive: updatedUser.isTrialActive !== undefined ? updatedUser.isTrialActive : data.users[userIndex].isTrialActive
    };

    fs.writeFileSync(apiPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour de l'utilisateur" },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un utilisateur
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const apiPath = '/app/config.json'
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf8'));
    
    const userIndex = data.users.findIndex((user: User) => user.id.toString() === id);
    
    if (userIndex === -1) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }
    
    // Supprimer l'utilisateur
    data.users.splice(userIndex, 1);
    
    // Écrire les modifications dans le fichier
    fs.writeFileSync(apiPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 }
    );
  }
}

//verification de la période d'essai 
function isTrialValid(user: User): boolean {
  if (!user.isTrialActive) return false;
  const now = new Date();
  const trialEnd = new Date(user.trialEndDate);
  return now <= trialEnd;
}
