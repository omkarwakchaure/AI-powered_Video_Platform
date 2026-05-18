import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { YOUTUBE_SEARCH_API } from '../../../utils/constants';
import SearchVideoCard from './SearchVideoCard';

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
      <div className="flex flex-col gap-4 mt-4 w-full max-w-6xl mx-auto px-2 sm:px-4">
        {results.map((video) => (
          <SearchVideoCard key={video.id} video={video} />
        ))}

        {loading && <p className="text-center py-4 text-text/60">Loading...</p>}
      </div>
    </div>
  );
};

export default SearchResults;
