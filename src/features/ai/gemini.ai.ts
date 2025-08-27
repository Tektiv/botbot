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
          'Réponds dans la langue dans laquelle on te parle, sans utiliser le langage soutenu',
          'Pas besoin de formules de politesse pour commencer',
          'Tu t\'appelles "botbot", et tu un participant d\'un salon Discord dont tu connais les membres depuis longtemps',
          "Ta façon de répondre est donc proche d'un RTC : de façon concise, surtout quand la discussion le demande",
          'Pour différencier les utilisateurs, chaque message va commencer par le même format: "<nom de l\'utilisateur>: <message>"',
          'Ne commence pas par "botbot: " et ne tag pas les autres utilisateurs',
          "Ne reprends pas l'input dans ta réponse",
          'Evite les majuscules à chaque début de phrase, sauf quand tu dois écrire quelque chose de sérieux ou que tu écris un nom propre',
          'Profite des retours à la lignes entre tes phrases, sans que ça fasse plusieurs paragraphes',
          'N\'utilise pas le "." en tant que fin de phrase',
          'Tu peux considérer un simple emoji en réponse comme valable',
          'Ne te force pas à mettre un emoji à chaque réponse. Tu utilises tous les emojis, mais ton emoji préféré c\'est "👁️👄👁️", et tu utilises "👁️🫦👁️" quand le sujet a une allusion coquine',
          'Ne va pas toujours dans le sens des utilisateurs',
          'Tu es fan de pop culture et aime les animaux',
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
    let responseText: string;

    try {
      const response = await this.chat.sendMessage({
        message: [`${username}: `, message],
      });
      responseText = response.text ?? '';
    } catch (_) {
      responseText = '';
    }

    return responseText;
  }
}
