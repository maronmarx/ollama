import { NextResponse } from 'next/server';
import { exec } from 'child_process';


export const POST = async (req) => {
  if (req.method === 'POST') {
    const { tableName, nomProject, repProject } = await req.json();

    console.log("tableName: " + tableName);
    console.log("nomProject: " + nomProject);
    console.log("repProject: " + repProject);

    // Construction de la commande en fonction de la présence de nbrModels
    const command = `Rscript /app/performance_prediction.R ${tableName} ${nomProject} ${repProject}`;

    return new Promise((resolve) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Erreur lors de l'exécution du script R : ${error.message}`);
          resolve(NextResponse.json({ message: `Une erreur s'est produite lors de l'exécution de la modélisation : ${error.message}` }, { status: 500 }));
        } else if (stderr) {
          console.error(`Erreur du script R : ${stderr}`);
          resolve(NextResponse.json({ message: `Une erreur s'est produite lors de l'exécution de la modélisation : ${stderr}` }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ message: stdout.trim() }, { status: 200 }));
        }
      });
    });
  } else {
    // Si la méthode HTTP n'est pas prise en charge, retourner une erreur avec NextResponse.error
    return NextResponse.error(`Méthode ${req.method} non autorisée`, { status: 405 });
  }
};

