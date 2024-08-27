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
      return NextResponse.json({ exists: true, projectPath });
    } catch {
      // Le répertoire n'existe pas, nous allons le créer
      try {
        await fs.mkdir(projectPath, { recursive: true });
        // Le répertoire a été créé
        return NextResponse.json({ exists: false, created: true , projectPath});
      } catch (mkdirError) {
        console.error('Erreur lors de la création du répertoire:', mkdirError);
        return NextResponse.json({ error: mkdirError.message }, { status: 500 });
      }
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du répertoire:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
