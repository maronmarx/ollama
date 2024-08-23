// pages/api/evaluer-deployer.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { nomProject } = req.body;

  if (!nomProject) {
    return res.status(400).json({ message: "Le nom du projet est requis" });
  }

  try {
    const projectPath = path.join("/app/deployer", nomProject);
    await fs.access(projectPath);
    res.status(200).json({ exists: true, projectPath  });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      res.status(200).json({ exists: false });
    } else {
      console.error("Erreur lors de la vérification du projet:", error);
      res
        .status(500)
        .json({ message: "Erreur serveur lors de la vérification du projet" });
    }
  }
}
