// pages/api/searchTableInPath.js
const fs = require('fs');
const path = require('path');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { tableName} = req.query;

    try {
      // Mapper le chemin utilisateur vers le chemin Docker
      const dockerPath = '/app/data';
      // Créer le chemin complet du fichier
      const filePath = path.join(dockerPath, tableName);

      // Vérifier si le fichier existe
      const fileExists = await fs.promises.access(filePath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

      // Renvoyer une réponse avec le statut et les données appropriées
      res.status(200).json({ exists: fileExists });
    } catch (error) {
      // En cas d'erreur, renvoyer une réponse avec le statut d'erreur
      console.error('Erreur lors de la recherche du fichier dans le chemin spécifié :', error);
      res.status(500).json({ error: 'Erreur lors de la recherche du fichier dans le chemin spécifié.' });
    }
  } else {
    // Si la méthode HTTP n'est pas prise en charge, renvoyer une réponse avec le statut approprié
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
