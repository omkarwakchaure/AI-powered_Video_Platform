import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generationConfig = {
  maxOutputTokens: 8192,
  thinkingConfig: { thinkingBudget: 0 },
};

// Ordered by preference: best quality first, fallback to higher-quota models
const MODEL_FALLBACK_CHAIN = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-2.0-flash'];

const parseAiJson = (responseText) => {
  let cleanJson = responseText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleanJson);
  } catch (firstError) {
    console.error('Parse failed:', firstError.message);
    console.error('Response length:', cleanJson.length);
    console.error('Last 100 chars:', cleanJson.slice(-100));

    const repaired = cleanJson.replace(/[\r\n\t]+/g, ' ');

    try {
      return JSON.parse(repaired);
    } catch (secondError) {
      console.error('Repaired parse also failed:', secondError.message);
      throw secondError;
    }
  }
};

// Try each model in the chain; on 429 (quota), move to next model
const callGeminiWithFallback = async (prompt) => {
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
        continue; // try next model in chain
      }

      // Non-quota error (network, invalid request, etc.) - don't fall back, throw immediately
      throw error;
    }
  }

  // All models exhausted
  throw lastError;
};

export const generateSummary = async (videoId) => {
  try {
    // ---------------------
    // 1. Video Info
    // ---------------------
    const videoResponse = await fetch(
      `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${process.env.GOOGLE_API_KEY}`
    );

    const videoData = await videoResponse.json();
    const video = videoData.items?.[0];

    if (!video) {
      throw new Error('Video not found');
    }

    // ---------------------
    // 2. Transcript
    // ---------------------
    let transcript;

    try {
      transcript = await YoutubeTranscript.fetchTranscript(videoId);
    } catch {
      const fallbackText = {
        english: 'Transcript unavailable for this video.',
        hindi: 'इस वीडियो के लिए ट्रांसक्रिप्ट उपलब्ध नहीं है।',
        marathi: 'या व्हिडिओसाठी ट्रान्सक्रिप्ट उपलब्ध नाही.',
      };

      return {
        videoInfo: {
          title: video.snippet.title,
          channelName: video.snippet.channelTitle,
        },
        summary: fallbackText,
        keyPoints: { english: [], hindi: [], marathi: [] },
        detailedGuide: { english: [], hindi: [], marathi: [] },
        importantTakeaways: { english: [], hindi: [], marathi: [] },
      };
    }

    const transcriptText = transcript.map((item) => item.text).join(' ');
    const trimmedTranscript = transcriptText.slice(0, 12000);

    // ---------------------
    // 3. Gemini Prompt
    // ---------------------
    const prompt = `
You are an expert content analyst and translator.

Analyze the transcript and return ONLY valid JSON, with no markdown formatting, no code fences, and no extra text.

IMPORTANT JSON FORMATTING RULES:
- All string values must be valid JSON strings
- Escape any double quotes inside text with \\"
- Do not include literal newline characters inside string values

Transcript: ${trimmedTranscript}

Requirements:
- Provide content in English, Hindi, and Marathi for: summary, keyPoints, detailedGuide, importantTakeaways
- summary: 100-150 words per language
- keyPoints: 5 to 8 items per language
- detailedGuide: 3 to 5 sections per language, each with 2-4 content items (same headings/structure across languages, translated)
- importantTakeaways: 3 to 5 items per language

Return ONLY this JSON structure:
{
  "summary": { "english": "", "hindi": "", "marathi": "" },
  "keyPoints": { "english": [], "hindi": [], "marathi": [] },
  "detailedGuide": {
    "english": [{ "heading": "", "content": [] }],
    "hindi": [{ "heading": "", "content": [] }],
    "marathi": [{ "heading": "", "content": [] }]
  },
  "importantTakeaways": { "english": [], "hindi": [], "marathi": [] }
}
`;

    // ---------------------
    // 4. Gemini Call (with model fallback)
    // ---------------------
    const result = await callGeminiWithFallback(prompt);
    const aiData = parseAiJson(result.response.text());

    // ---------------------
    // 5. Final Response
    // ---------------------
    return {
      videoInfo: {
        title: video.snippet.title,
        channelName: video.snippet.channelTitle,
        duration: video.contentDetails?.duration,
        category: video.snippet.categoryId,
      },
      summary: aiData.summary,
      keyPoints: aiData.keyPoints,
      detailedGuide: aiData.detailedGuide,
      importantTakeaways: aiData.importantTakeaways,
    };
  } catch (error) {
    console.error('AI Summary Error:', error);
    throw error;
  }
};
