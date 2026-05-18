export default async function handler(req, res) {
  const videoId = req.query.videoId;

  if (!videoId) {
    return res.status(400).json({ error: 'Missing videoId' });
  }

  const url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&maxResults=20&key=${process.env.GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data.items || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Comments fetch failed' });
  }
}
