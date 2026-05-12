import React from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const VideoCard = ({ info }) => {
  const { snippet, statistics, contentDetails } = info;
  const { channelTitle, title, thumbnails, publishedAt } = snippet;

  const views = new Intl.NumberFormat("en", { notation: "compact" }).format(
    statistics?.viewCount || 0
  );

  return (
    <div className="w-full cursor-pointer">
      {/* Thumbnail */}
      <div className="relative">
        <img
          className="rounded-xl w-full transition-transform duration-200 hover:scale-105"
          src={thumbnails.medium.url}
          alt={title}
        />

        {/* Duration */}
        <span className="absolute bottom-2 right-2 text-xs bg-black/80 text-plain px-1.5 py-0.5 rounded">
          {contentDetails?.duration?.replace("PT", "").toLowerCase()}
        </span>

        {/* Watch Later */}
        <span className="absolute top-2 right-2 bg-black/50 p-1 rounded-full opacity-0 hover:opacity-100 transition">
          ⏱
        </span>
      </div>

      {/* Bottom info */}
      <div className="mt-3">
        <ul>
          <li className="font-semibold text-sm line-clamp-2 text-text/90" title={title}>
            {title}
          </li>
          <li className="text-xs text-text/80 mt-1">{channelTitle}</li>
          <li className="text-xs text-text/60">
            {views} views • {formatDistanceToNow(new Date(publishedAt))} ago
          </li>
        </ul>
      </div>
    </div>
  );
};

export default VideoCard;
