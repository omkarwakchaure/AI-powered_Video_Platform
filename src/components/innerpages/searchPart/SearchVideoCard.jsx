import React from 'react';
import { Link } from 'react-router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const SearchVideoCard = ({ video }) => {
  const { snippet, id } = video;

  return (
    <Link
      to={'/watch?v=' + id}
      className="
        flex flex-col md:flex-row
        gap-4
        w-full
        hover:bg-background
        rounded-xl
        p-2
        transition
      "
    >
      {/* Thumbnail */}
      <div className="w-full md:w-[420px] flex-shrink-0">
        <img
          src={snippet.thumbnails.high.url}
          alt={snippet.title}
          className="
            w-full
            aspect-video
            object-cover
            rounded-xl
          "
        />
      </div>

      {/* Right Side */}
      <div className="flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-sm sm:text-base font-semibold line-clamp-2 text-text">{snippet.title}</h3>

        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-text/60 mt-2">
          <span>{snippet.channelTitle}</span>
          <span>•</span>

          <span>{formatDistanceToNow(new Date(snippet.publishTime))} ago</span>
        </div>

        {/* Description */}
        {snippet.description && <p className="text-sm text-text/70 mt-3 line-clamp-3">{snippet.description}</p>}
      </div>
    </Link>
  );
};

export default SearchVideoCard;
