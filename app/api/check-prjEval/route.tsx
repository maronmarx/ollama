import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const { nomProjet } = await req.json();
    const projectPath = path.join('/app/projet', nomProjet);

    try {
      await fs.access(projectPath);
      // Le répertoire existe
      return NextResponse.json({ exists: true, fullPath: projectPath });
    } catch {
      // Le répertoire n'existe pas
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du répertoire:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
