import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { YOUTUBE_SUGGESTION_API } from '../../../utils/constants';
import { cacheResults } from '../../../store/slices/searchSlice';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const searchCache = useSelector((store) => store.search);

  useEffect(() => {
    const timer = setTimeout(() => {
      const cached = searchCache[searchQuery];
      if (cached && Array.isArray(cached)) {
        setSuggestions(cached);
      } else {
        getSearchSuggestions();
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getSearchSuggestions = async () => {
    if (!searchQuery) return;
    const data = await fetch(`${YOUTUBE_SUGGESTION_API}?q=${searchQuery}`);
    const json = await data.json();
    const suggestionsArray = Array.isArray(json) ? json : [];
    setSuggestions(suggestionsArray);
    setSuggestionsVisible(true);
    dispatch(cacheResults({ [searchQuery]: suggestionsArray }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setSuggestionsVisible(true);
  };

  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('.suggest-box') && !e.target.closest('.search-input')) {
        setSuggestionsVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="flex relative w-full">
      {/* Left Icon (only when focused) */}
      {isFocused && <MagnifyingGlassIcon className="h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text/50" />}

      <input
        value={searchQuery}
        onChange={handleSearch}
        onFocus={() => {
          setIsFocused(true);
          if (searchQuery.trim().length > 0) setSuggestionsVisible(true);
        }}
        onBlur={() => setIsFocused(false)}
        className={`search-input w-full border border-border bg-plain text-text placeholder:text-text/40 p-2 rounded-l-full outline-none focus:border-primary transition-colors ${
          isFocused ? 'pl-10' : 'pl-4'
        }`}
        type="text"
        placeholder="Search"
      />

      {/* Right Search Button */}
      <button
        className="border border-border border-l-0 p-3 w-14 rounded-r-full bg-background hover:bg-border/40 flex items-center justify-center cursor-pointer transition-colors"
        onClick={() => navigate('/search?q=' + searchQuery)}
      >
        <MagnifyingGlassIcon className="h-5 text-text/70" />
      </button>

      {/* Suggestion Box */}
      {suggestionsVisible && suggestions.length > 0 && (
        <div className="suggest-box absolute top-full left-0 mt-1 bg-plain border border-border shadow-lg rounded-xl py-2 w-full z-50">
          <ul>
            {suggestions.map((suggestion) => (
              <li
                key={suggestion}
                onClick={() => {
                  setSearchQuery(suggestion);
                  setSuggestionsVisible(false);
                  navigate('/search?q=' + suggestion);
                }}
                className="flex items-center gap-3 px-3 py-2 text-sm text-text cursor-pointer hover:bg-background rounded-xl transition-colors mx-2"
              >
                <MagnifyingGlassIcon className="h-4 text-text/50 shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
