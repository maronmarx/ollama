import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';


export const POST = async (req) => {
  try {
    const { nomProject, modelType } = await req.json();

    // Chemin complet du répertoire à vérifier
    const fullPath = path.join('/app/projet', nomProject);

    try {
      await fs.access(fullPath, fs.constants.F_OK);
      console.log(`Le répertoire ${fullPath} existe.`);
      return NextResponse.json({ message: `Le répertoire ${fullPath} existe.`, fullPath }, { status: 200 });
    } catch (err) {
      console.log(`Le répertoire ${fullPath} n'existe pas.`);
      if (modelType === 'prediction') {
        try {
          await fs.mkdir(fullPath, { recursive: true });
          console.log(`Le répertoire ${fullPath} a été créé.`);
          return NextResponse.json({ message: `Le répertoire ${fullPath} n'existe pas, mais il a été créé.`, fullPath }, { status: 404 });
        } catch (mkdirErr) {
          console.error(`Erreur lors de la création du répertoire: ${mkdirErr}`);
          return NextResponse.json({ message: `Erreur lors de la création du répertoire: ${mkdirErr.message}` }, { status: 500 });
        }
      } else {
        return NextResponse.json({ message: `Le répertoire ${fullPath} n'existe pas.` }, { status: 404 });
      }
    }
  } catch (error) {
    console.error('Erreur lors du traitement de la requête:', error);
    return NextResponse.json({ message: 'Erreur lors du traitement de la requête' }, { status: 500 });
  }
};
