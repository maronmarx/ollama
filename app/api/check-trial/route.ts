import fs from 'fs';
import { User } from "@/../../app/users/types";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    const apiPath = '/app/config.json'
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf-8'));
    const user = data.users.find((u: User) => u.id === userId);

    if (user) {
      const isValid = isTrialValid(user);
      if (!isValid) {
        user.isTrialActive = false;
        fs.writeFileSync(apiPath, JSON.stringify(data, null, 2));
      }
      return Response.json({ isTrialActive: isValid });
    } else {
      return Response.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de la période d'essai:", error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

function isTrialValid(user: User): boolean {
  if (!user.isTrialActive) return false;
  const now = new Date();
  const trialEnd = new Date(user.trialEndDate);
  return now <= trialEnd;
}