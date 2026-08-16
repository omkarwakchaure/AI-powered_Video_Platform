import { generateSummary } from '../../src/services/aiSummaryService.js';

export default async function handler(req, res) {
  const { videoId } = req.query;

  try {
    const summaryData = await generateSummary(videoId);

    return res.status(200).json(summaryData);
  } catch (error) {
    console.error(error);

    if (error.status === 429) {
      return res.status(429).json({
        message: 'AI service is rate-limited right now. Please try again in a minute.',
      });
    }

    return res.status(500).json({
      message: 'Failed to generate summary',
    });
  }
}
