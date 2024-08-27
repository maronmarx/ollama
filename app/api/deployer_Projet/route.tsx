import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const { nomProject } = await req.json();
    console.log("nomProject to deploy", nomProject);

    const sourcePath = path.join("/app/projet", nomProject);
    const destPath = path.join("/app/deployer", nomProject);

    const projectExistsInSource = await fs.access(sourcePath).then(() => true).catch(() => false);
    const projectExistsInDest = await fs.access(destPath).then(() => true).catch(() => false);

    if (!projectExistsInSource) {
      return NextResponse.json(
        { message: `Le projet '${nomProject}' n'existe pas dans le répertoire source.` },
        { status: 404 }
      );
    }

    if (projectExistsInDest) {
      return NextResponse.json(
        { message: `Le projet '${nomProject}' existe déjà dans le répertoire destination.` },
        { status: 409 }
      );
    }

    await fs.cp(sourcePath, destPath, { recursive: true });
    return NextResponse.json(
      { message: `Le projet '${nomProject}' a été déployé avec succès.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors du déploiement:", error);
    return NextResponse.json(
      { message: "Erreur lors du déploiement du projet. Veuillez réessayer plus tard." },
      { status: 500 }
    );
  }
}