import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Link } from 'react-router';

import { YOUTUBE_VIDEOS_API } from '../../../utils/constants';
import VideoCard from './VideoCard';
import ShimmerBlock from '../../commonFiles/ShimmerBlock';

const VideoCardShimmer = () => (
  <div className="space-y-3">
    <ShimmerBlock className="aspect-video w-full rounded-xl" />
    <div className="flex gap-3">
      <ShimmerBlock className="h-9 w-9 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <ShimmerBlock className="h-4 w-full" />
        <ShimmerBlock className="h-3 w-2/3" />
        <ShimmerBlock className="h-3 w-1/2" />
      </div>
    </div>
  </div>
);

const VideoContainer = ({ scrollRef }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const nextPageTokenRef = useRef(null);
  const loadingRef = useRef(false);
  const containerRef = useRef(null);

  const getVideos = useCallback(async () => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    const token = nextPageTokenRef.current;
    const separator = YOUTUBE_VIDEOS_API.includes('?') ? '&' : '?';
    const url = token ? `${YOUTUBE_VIDEOS_API}${separator}pageToken=${token}` : YOUTUBE_VIDEOS_API;

    const data = await fetch(url);
    const res = await data.json();

    setVideos((prev) => {
      const videoMap = new Map();
      [...prev, ...res.items].forEach((video) => videoMap.set(video.id, video));
      return Array.from(videoMap.values());
    });

    nextPageTokenRef.current = res.nextPageToken || null;
    loadingRef.current = false;
    setLoading(false);
  }, []);

  useEffect(() => {
    getVideos();
  }, []);

  // Infinite scroll handler
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 300;

      if (nearBottom) getVideos();
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [getVideos, scrollRef]);

  return (
    <div
      ref={containerRef}
      className=" grid
      grid-cols-1
      sm:grid-cols-2
      lg:grid-cols-3
      xl:grid-cols-4
      gap-6
      px-2 sm:px-4"
    >
      {videos.map((video) => (
        <Link key={video.id} to={'/watch?v=' + video.id}>
          <VideoCard info={video} />
        </Link>
      ))}

      {loading && Array.from({ length: 8 }).map((_, idx) => <VideoCardShimmer key={`shimmer-${idx}`} />)}
    </div>
  );
};

export default VideoContainer;
