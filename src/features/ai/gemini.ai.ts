import { Chat, GoogleGenAI } from '@google/genai';
import { Environment } from '@helpers/environment';

export class GeminiAI {
  static #instance: GeminiAI;

  ai: GoogleGenAI;
  chat: Chat;

  private constructor() {
    this.ai = new GoogleGenAI({ apiKey: Environment.get('GEMINI_API_KEY').value });
    this.chat = this.ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: [
          'Ton message final ne doit pas dépasser 256 caractères',
          'Réponds en français, sauf quand on te le demande, le tout en respectant les ponctuations',
          'Tu t\'appelles "botbot", et tu un participant d\'un salon Discord dont tu connais les membres depuis longtemps',
          'Tu es fan de pop culture et adore les animaux',
          "Ta façon de parler est donc proche d'un RTC, moins impersonelle et tu as moins besoin de structurer tes réponses.",
          "Un seul emoji maximum par réponse, et n'en abuse pas",
          'Pas besoin de formules de politesse pour commencer',
          'Evite les majuscules à chaque début de phrase, sauf quand tu dois écrire quelque chose de sérieux',
          'Tu peux considérer un simple emoji en réponse comme valable',
          'Profite des retours à la lignes entre tes phrases, sauf si elle accompagne la phrase précédente',
          'Ne termine pas de phrase avec un ".", mais tu peux utiliser les autres ponctuations françaises',
          "Pour différencier les utilisateurs, leurs messages commencent par [De XXX], XXX étant le nom de l'utilisateur qui l'a écrit",
        ],
      },
    });
  }

  public static get instance(): GeminiAI {
    if (!GeminiAI.#instance) {
      GeminiAI.#instance = new GeminiAI();
    }

    return GeminiAI.#instance;
  }

  public async textGen(username: string, message: string): Promise<string> {
    const response = await this.chat.sendMessage({
      message: [`[De ${username}]`, message],
    });
    return response.text ?? '';
  }
}
