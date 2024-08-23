import fs from 'fs/promises';
import path from 'path';
import AdmZip from 'adm-zip';
import { NextRequest, NextResponse } from 'next/server';


export const POST = async (req) => {
  const { nomProject, projectDirectory } = await req.json();

  try {
    // Définir le chemin de destination
    const destDir = path.join('/app/partager', nomProject);

    // Vérifier si le projet existe déjà
    const exists = await fs.access(destDir)
      .then(() => true)
      .catch(() => false);

    if (exists) {
      return NextResponse.json({ message: `Le projet '${nomProject}' existe déjà.` }, { status: 409 });
    }

    // Créer une archive du répertoire
    const zip = new AdmZip();
    zip.addLocalFolder(projectDirectory);

    // Convertir l'archive en tampon
    const buffer = zip.toBuffer();

    // Créer le répertoire de destination
    await fs.mkdir(destDir, { recursive: true });

    // Écrire le fichier archive dans le répertoire de destination
    const zipPath = path.join(destDir, 'files.zip');
    await fs.writeFile(zipPath, buffer);

    // Extraire les fichiers de l'archive
    zip.extractAllTo(destDir, true);

    // Supprimer l'archive
    await fs.unlink(zipPath);

    // Envoyer une réponse avec succès
    return NextResponse.json({ message: `Le projet '${nomProject}' a été partagé avec succès.` }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors du partage:', error);
    // Envoyer une réponse d'erreur
    return NextResponse.json({ message: 'Une erreur est survenue. Veuillez réessayer plus tard.' }, { status: 500 });
  }
}
