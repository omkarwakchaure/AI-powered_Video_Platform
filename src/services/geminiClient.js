import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generationConfig = {
  maxOutputTokens: 8192,
  thinkingConfig: { thinkingBudget: 0 },
};

// Ordered by preference: best quality first, fallback to higher-quota models
const MODEL_FALLBACK_CHAIN = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];

// Try each model in the chain; on 429 (quota), move to next model
export const callGeminiWithFallback = async (prompt) => {
  let lastError;

  for (const modelName of MODEL_FALLBACK_CHAIN) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig,
      });

      console.log(`Trying model: ${modelName}`);
      const result = await model.generateContent(prompt);

      console.log(`Success with model: ${modelName}`);
      return result;
    } catch (error) {
      lastError = error;

      if (error.status === 429) {
        console.log(`Quota exceeded for ${modelName}, trying next model...`);
        continue;
      }

      throw error;
    }
  }

  throw lastError;
};
