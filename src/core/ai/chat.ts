import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

// Types pour la requête
interface ChatRequest {
  message: string;
  history: Array<{ role: string; content: string }>;
  modelData: {
    prenom: string;
    age: number;
    nationalite: string;
    domicile: string;
    citation: string;
    passe_temps: string;
  } | null;
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    const { message, history, modelData }: ChatRequest = req.body;

    // Vérifier que la clé API est configurée
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Clé API OpenAI non configurée" });
    }

    // Préparer le contexte de conversation
    const messages: any[] = [
      {
        role: "system",
        content: modelData
          ? `Tu es un assistant conversationnel sympathique nommé ${modelData.prenom}. 
             Tu as ${modelData.age} ans, tu es de nationalité ${modelData.nationalite} et tu habites à ${modelData.domicile}.
             Ta citation préférée est: "${modelData.citation}" et ton passe-temps est: ${modelData.passe_temps}.
             Sois naturel, chaleureux et engageant dans tes réponses.`
          : `Tu es un assistant conversationnel sympathique. Sois naturel, chaleureux et engageant dans tes réponses.`,
      },
      ...history,
      { role: "user", content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "Désolé, je n'ai pas pu générer de réponse.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({ error: "Erreur lors de la génération de réponse" });
  }
}
