/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Simple in-memory translation cache (per session)
const translationCache: Record<string, string> = {};

export async function translateText(text: string, sourceLang: string, targetLang: string = 'zh'): Promise<string> {
  const cacheKey = `${text}_${targetLang}`;
  
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a helpful translation assistant for a cat-loving community called "PawAtlas". 
    Strictly translate the following text from ${sourceLang} to ${targetLang}. 
    Maintain a warm, friendly, and "healing" tone suitable for cat lovers.
    Do NOT add any explanations or extra words, just provide the translation.
    
    Text to translate: "${text}"`,
    });

    const translatedText = response.text?.trim().replace(/^"|"$/g, '') || "无法获取翻译内容喵～";
    
    translationCache[cacheKey] = translatedText;
    return translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return "翻译失败，请稍后再试喵～";
  }
}
