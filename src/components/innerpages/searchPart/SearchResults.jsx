import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { YOUTUBE_SEARCH_API } from '../../../utils/constants';
import SearchVideoCard from './SearchVideoCard';
import ButtonList from '../../buttons/ButtonList';
import ShimmerBlock from '../../commonFiles/ShimmerBlock';

const SearchVideoCardShimmer = () => (
  <div className="flex flex-col sm:flex-row gap-4 w-full">
    <ShimmerBlock className="w-full sm:w-80 aspect-video rounded-xl flex-shrink-0" />
    <div className="flex-1 space-y-2 py-1">
      <ShimmerBlock className="h-5 w-3/4" />
      <ShimmerBlock className="h-3 w-1/3" />
      <div className="flex items-center gap-2 mt-2">
        <ShimmerBlock className="h-6 w-6 rounded-full" />
        <ShimmerBlock className="h-3 w-1/4" />
      </div>
      <ShimmerBlock className="h-3 w-full mt-2" />
      <ShimmerBlock className="h-3 w-5/6" />
    </div>
  </div>
);

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);

  const { search } = useLocation();
  const query = new URLSearchParams(search).get('q');

  const getSearchResults = useCallback(async () => {
    if (!query || loading) return;

    setLoading(true);

    const separator = YOUTUBE_SEARCH_API(query).includes('?') ? '&' : '?';

    const url = nextPageToken != null ? `${YOUTUBE_SEARCH_API(query)}${separator}pageToken=${nextPageToken}` : YOUTUBE_SEARCH_API(query);

    const res = await fetch(url);
    const data = await res.json();

    const videosWithId = data
      .filter((item) => item.id.kind === 'youtube#video')
      .map((item) => ({
        ...item,
        id: item.id.videoId,
      }));

    setResults((prev) => {
      const videoMap = new Map();

      [...prev, ...videosWithId].forEach((video) => {
        videoMap.set(video.id, video);
      });

      return Array.from(videoMap.values());
    });

    setNextPageToken(data.nextPageToken || null);
    setLoading(false);
  }, [query, nextPageToken, loading]);

  // reset when query changes
  useEffect(() => {
    setResults([]);
    setNextPageToken(null);
  }, [query]);

  // initial fetch after query reset
  useEffect(() => {
    getSearchResults();
  }, [query]);

  // infinite scroll
  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const nearBottom = scrollTop + clientHeight >= scrollHeight - 300;

      if (nearBottom && !loading) {
        getSearchResults();
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);

    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [getSearchResults, loading]);

  return (
    <div ref={containerRef} className="h-full overflow-y-auto">
      <div className="sticky top-0 z-10 bg-plain">
        <ButtonList />
      </div>

      <div className="flex flex-col gap-4 mt-4 w-full max-w-6xl mx-auto px-2 sm:px-4">
        {results.map((video) => (
          <SearchVideoCard key={video.id} video={video} isLive={video.snippet.liveBroadcastContent === 'live'} />
        ))}

        {loading && Array.from({ length: 5 }).map((_, idx) => <SearchVideoCardShimmer key={`shimmer-${idx}`} />)}
      </div>
    </div>
  );
};

export default SearchResults;
