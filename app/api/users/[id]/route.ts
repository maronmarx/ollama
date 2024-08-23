import fs from 'fs';  // Module pour l'interaction avec le système de fichiers.
import { NextResponse } from 'next/server';  // NextResponse est utilisé pour créer des réponses HTTP dans Next.js.
import path from 'path';  // Module pour manipuler les chemins de fichiers.

// PUT: Mettre à jour un utilisateur existant
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Récupération de l'identifiant de l'utilisateur à partir des paramètres de la requête
    const id = params.id;
    // Extraction des nouvelles données de l'utilisateur à partir du corps de la requête
    const updatedUser = await request.json();

    // Construction du chemin vers le fichier api.json
    const apiPath = '/app/config.json'
    // Lecture du fichier api.json pour obtenir les données existantes
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf8'));

    // Recherche de l'utilisateur dans le tableau en utilisant son identifiant
    const userIndex = data.users.findIndex((user: any) => user.id.toString() === id);

    // Si l'utilisateur n'est pas trouvé, renvoyer une réponse 404
    if (userIndex === -1) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Mettre à jour les informations de l'utilisateur avec les nouvelles données
    data.users[userIndex] = { 
      ...data.users[userIndex],  // Conserver les données existantes
      ...updatedUser,  // Remplacer ou ajouter les nouvelles données
      // Conserver les dates d'essai si elles ne sont pas fournies dans les nouvelles données
      trialStartDate: updatedUser.trialStartDate || data.users[userIndex].trialStartDate,
      trialEndDate: updatedUser.trialEndDate || data.users[userIndex].trialEndDate,
      // Conserver l'état de l'essai si aucune nouvelle valeur n'est fournie
      isTrialActive: updatedUser.isTrialActive !== undefined ? updatedUser.isTrialActive : data.users[userIndex].isTrialActive
    };

    // Écrire les modifications dans le fichier api.json
    fs.writeFileSync(apiPath, JSON.stringify(data, null, 2));

    // Renvoyer une réponse indiquant que l'utilisateur a été mis à jour avec succès
    return NextResponse.json({ message: 'Utilisateur mis à jour avec succès' });
  } catch (error) {
    // Gérer les erreurs éventuelles et renvoyer une réponse 500 en cas d'échec
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour de l'utilisateur" },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un utilisateur
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Récupération de l'identifiant de l'utilisateur à partir des paramètres de la requête
    const id = params.id;
    // Construction du chemin vers le fichier api.json
    const apiPath = '/app/config.json'
    // Lecture du fichier api.json pour obtenir les données existantes
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf8'));
    
    // Recherche de l'utilisateur dans le tableau en utilisant son identifiant
    const userIndex = data.users.findIndex((user: any) => user.id.toString() === id);
    
    // Si l'utilisateur n'est pas trouvé, renvoyer une réponse 404
    if (userIndex === -1) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 });
    }
    
    // Supprimer l'utilisateur du tableau
    data.users.splice(userIndex, 1);
    
    // Écrire les modifications dans le fichier api.json
    fs.writeFileSync(apiPath, JSON.stringify(data, null, 2));
    
    // Renvoyer une réponse indiquant que l'utilisateur a été supprimé avec succès
    return NextResponse.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    // Gérer les erreurs éventuelles et renvoyer une réponse 500 en cas d'échec
    console.error("Erreur lors de la suppression de l'utilisateur:", error);
    return NextResponse.json(
      { message: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 }
    );
  }
}
