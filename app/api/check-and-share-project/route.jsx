// pages/api/check-and-share-project.js
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const { nomProjet } = await req.json();
    const sourceDir = path.join('/app/projet', nomProjet);
    const destDir = path.join('/app/partager', nomProjet);

    const sourceExists = await fs.access(sourceDir).then(() => true).catch(() => false);
    const destExists = await fs.access(destDir).then(() => true).catch(() => false);

    if (sourceExists && !destExists) {
      // Case 1: Project exists in source but not in destination
      await fs.cp(sourceDir, destDir, { recursive: true });
      return NextResponse.json({
        status: 'success',
        message: `Le répertoire existe dans le chemin /app/projet/${nomProjet} et il est partagé avec succès`,
        case: 1
      });
    } else if (!sourceExists && destExists) {
      // Case 2: Project doesn't exist in source but exists in destination
      return NextResponse.json({
        status: 'warning',
        message: `Le répertoire existe déjà dans le chemin de destination /app/partager/${nomProjet}`,
        case: 2
      });
    } else if (!sourceExists && !destExists) {
      // Case 3: Project doesn't exist in either source or destination
      return NextResponse.json({
        status: 'error',
        message: `Le répertoire n'existe ni dans projet ni dans partager`,
        case: 3
      });
    } else {
      // Project exists in both source and destination
      return NextResponse.json({
        status: 'info',
        message: `Le répertoire existe déjà dans les deux chemins projet et partager`,
        case: 4
      });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification ou du partage du répertoire:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}