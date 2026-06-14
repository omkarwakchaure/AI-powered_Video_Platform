import { YoutubeTranscript } from 'youtube-transcript';
import { callGeminiWithFallback } from './geminiClient.js';
import { parseAiJson } from '../utils/jsonParser.js';

const TRANSCRIPT_FALLBACK = {
  english: 'Transcript unavailable for this video.',
  hindi: 'इस वीडियो के लिए ट्रांसक्रिप्ट उपलब्ध नहीं है।',
  marathi: 'या व्हिडिओसाठी ट्रान्सक्रिप्ट उपलब्ध नाही.',
};

const fetchVideoInfo = async (videoId) => {
  const videoResponse = await fetch(
    `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${process.env.GOOGLE_API_KEY}`
  );

  const videoData = await videoResponse.json();
  const video = videoData.items?.[0];

  if (!video) {
    throw new Error('Video not found');
  }

  return video;
};

const fetchTranscriptText = async (videoId) => {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map((item) => item.text).join(' ');
  } catch {
    return null;
  }
};

const buildPrompt = (transcriptText) => `
You are an expert content analyst and translator.

Analyze the transcript and return ONLY valid JSON, with no markdown formatting, no code fences, and no extra text.

IMPORTANT JSON FORMATTING RULES:
- All string values must be valid JSON strings
- Escape any double quotes inside text with \\"
- Do not include literal newline characters inside string values

Transcript: ${transcriptText}

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

export const generateSummary = async (videoId) => {
  try {
    const video = await fetchVideoInfo(videoId);
    const transcriptText = await fetchTranscriptText(videoId);

    if (!transcriptText) {
      return {
        videoInfo: {
          title: video.snippet.title,
          channelName: video.snippet.channelTitle,
        },
        summary: TRANSCRIPT_FALLBACK,
        keyPoints: { english: [], hindi: [], marathi: [] },
        detailedGuide: { english: [], hindi: [], marathi: [] },
        importantTakeaways: { english: [], hindi: [], marathi: [] },
      };
    }

    const trimmedTranscript = transcriptText.slice(0, 12000);
    const prompt = buildPrompt(trimmedTranscript);

    const result = await callGeminiWithFallback(prompt);
    const aiData = parseAiJson(result.response.text());

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
