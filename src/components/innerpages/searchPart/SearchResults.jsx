import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { YOUTUBE_SEARCH_API } from '../../../utils/constants';
import SearchVideoCard from './SearchVideoCard';

const SearchResults = () => {
  const [results, setResults] = useState([]);

  const { search } = useLocation();
  const query = new URLSearchParams(search).get('q');

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      const res = await fetch(YOUTUBE_SEARCH_API(query));
      const data = await res.json();

      const videosWithId = data
        .filter((item) => item.id.kind === 'youtube#video')
        .map((item) => ({
          ...item,
          id: item.id.videoId, // normalize id
        }));

      setResults(videosWithId);
    };
    fetchResults();
  }, [query]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="flex flex-col gap-4 mt-4 w-full max-w-6xl mx-auto px-2 sm:px-4">
        {results.map((video) => (
          <SearchVideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
