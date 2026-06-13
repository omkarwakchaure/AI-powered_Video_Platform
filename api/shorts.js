export default async function handler(req, res) {
  try {
    const { pageToken = '' } = req.query;

    const searchRes = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=25&q=trending shorts&pageToken=${pageToken}&key=${process.env.GOOGLE_API_KEY}`
    );

    const searchData = await searchRes.json();

    const ids = searchData.items.map((item) => item.id.videoId).join(',');

    const videosRes = await fetch(`https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${ids}&key=${process.env.GOOGLE_API_KEY}`);

    const videosData = await videosRes.json();

    const shorts = videosData.items.filter((video) => {
      const duration = video.contentDetails.duration;

      const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);

      const minutes = Number(match?.[1] || 0);
      const seconds = Number(match?.[2] || 0);

      return minutes === 0 && seconds <= 60;
    });

    res.status(200).json({
      items: shorts,
      nextPageToken: searchData.nextPageToken || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Failed to fetch shorts',
    });
  }
}
