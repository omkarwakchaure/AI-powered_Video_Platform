import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Link } from 'react-router';

import { YOUTUBE_VIDEOS_API } from '../../../utils/constants';
import VideoCard from './VideoCard';

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const getVideos = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const url = nextPageToken != null ? `${YOUTUBE_VIDEOS_API}&pageToken=${nextPageToken}` : YOUTUBE_VIDEOS_API;

    const data = await fetch(url);
    const res = await data.json();

    setVideos((prev) => [...prev, ...res.items]);
    setNextPageToken(res.nextPageToken || null);
    setLoading(false);
  }, [nextPageToken, loading]);

  useEffect(() => {
    getVideos();
  }, []);

  useEffect(() => {
    const scrollContainer = containerRef.current?.closest('main');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 300;

      if (nearBottom && !loading) getVideos();
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [getVideos, loading]);

  return (
    <div ref={containerRef} className="flex flex-wrap ml-12">
      {videos.map((video) => (
        <Link key={video.id} to={'/watch?v=' + video.id}>
          <VideoCard info={video} />
        </Link>
      ))}

      {loading && <p className="text-center w-full py-4 text-gray-500">Loading...</p>}
    </div>
  );
};

export default VideoContainer;
