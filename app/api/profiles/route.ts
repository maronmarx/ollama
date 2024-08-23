import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getProfiles() {
  const apiPath = '/app/config.json'
  return JSON.parse(fs.readFileSync(apiPath, 'utf8'));
}

function saveProfiles(data: any) {
  const apiPath = '/app/config.json'
  fs.writeFileSync(apiPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  try {
    const apiPath = '/app/config.json'
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf8'));
    return NextResponse.json({ profiles: data.profiles });
  } catch (error) {
    console.error("Erreur lors de la récupération des profils:", error);
    return NextResponse.json({ error: "Erreur lors de la récupération des profils" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newProfile = await request.json();
    const apiPath = '/app/config.json'
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf8'));
    
    data.profiles.push(newProfile);
    fs.writeFileSync(apiPath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ message: 'Profil ajouté avec succès', profile: newProfile });
  } catch (error) {
    console.error("Erreur lors de l'ajout du profil:", error);
    return NextResponse.json({ error: "Erreur lors de l'ajout du profil" }, { status: 500 });
  }
}

// PUT pour modifier un profil
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "ID du profil non fourni" }, { status: 400 });
    }

    const updatedProfile = await request.json();
    const data = getProfiles();
    const index = data.profiles.findIndex((p: any) => p.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
    }
    
    data.profiles[index] = { ...data.profiles[index], ...updatedProfile };
    saveProfiles(data);
    
    return NextResponse.json({ message: 'Profil mis à jour avec succès', profile: data.profiles[index] });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour du profil" }, { status: 500 });
  }
}

// DELETE pour supprimer un profil
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "ID du profil non fourni" }, { status: 400 });
    }
    
    const data = getProfiles();
    const initialLength = data.profiles.length;
    data.profiles = data.profiles.filter((p: any) => p.id !== id);
    
    if (data.profiles.length === initialLength) {
      return NextResponse.json({ error: "Profil non trouvé" }, { status: 404 });
    }
    
    saveProfiles(data);
    
    return NextResponse.json({ message: 'Profil supprimé avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression du profil:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression du profil" }, { status: 500 });
  }
}