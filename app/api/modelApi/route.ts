import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: "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",
});

interface Message {
  role: "user" | "assistant";

  content: string;
}

let historique: Message[] = [];

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (typeof question !== "string") {
      return NextResponse.json(
        { response: "Invalid question format" },
        { status: 400 }
      );
    }

    if (!question.trim().toLowerCase().includes("exit")) {
      // Ajouter la question de l'utilisateur à l'historique
      historique.push({ role: "user", content: question });

      try {
        // Créer la requête de complétion de chat avec l'historique des messages
        const chatCompletion = await groq.chat.completions.create({
          messages: historique,
          model: "llama3-70b-8192",
        });

        // Récupérer la réponse du chatbot
        const reponse = chatCompletion.choices[0]?.message?.content ?? null;

        if (typeof reponse === "string") {
          // Ajouter la réponse du chatbot à l'historique
          historique.push({ role: "assistant", content: reponse });

          // Afficher la réponse
          console.log("Réponse:", reponse);
          return NextResponse.json({ response: reponse }, { status: 200 });
        } else {
          throw new Error("Réponse du chatbot non valide.");
        }
      } catch (error) {
        console.error("Erreur lors de la génération de la réponse:", error);
        return NextResponse.json(
          { response: "Erreur interne du serveur" },
          { status: 500 }
        );
      }
    } else {
      console.log("Fin de la session de questions.");
      return NextResponse.json(
        { response: "Session terminée" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Erreur lors de la lecture de la requête:", error);
    return NextResponse.json(
      { response: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
