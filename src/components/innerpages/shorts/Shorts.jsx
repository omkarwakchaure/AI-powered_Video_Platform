import React, { useEffect, useRef, useState } from 'react';
import { HeartIcon, ChatBubbleOvalLeftIcon, ShareIcon } from '@heroicons/react/24/outline';

const Shorts = () => {
  const [shorts, setShorts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(localStorage.getItem('shorts-muted') !== 'false');

  const containerRef = useRef(null);

  const getShorts = async (pageToken = '') => {
    if (loading) return;

    setLoading(true);

    try {
      const url = pageToken ? `/api/shorts?pageToken=${pageToken}` : '/api/shorts';

      const res = await fetch(url);
      const data = await res.json();

      setShorts((prev) => {
        const map = new Map();

        [...prev, ...(data.items || [])].forEach((video) => {
          map.set(video.id, video);
        });

        return Array.from(map.values());
      });

      setNextPageToken(data.nextPageToken);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getShorts();
  }, []);

  useEffect(() => {
    if (activeIndex >= shorts.length - 3 && nextPageToken && !loading) {
      getShorts(nextPageToken);
    }
  }, [activeIndex, nextPageToken, loading]);

  const handleScroll = () => {
    const container = containerRef.current;

    if (!container) return;

    const currentIndex = Math.round(container.scrollTop / (container.scrollHeight / shorts.length));
    setActiveIndex(currentIndex);

    // User is near last shorts
    if (currentIndex >= shorts.length - 3 && nextPageToken && !loading) {
      getShorts(nextPageToken);
    }
  };

  const handleUnmute = () => {
    setIsMuted(false);
    localStorage.setItem('shorts-muted', 'false');
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="
        h-full
        overflow-y-auto
        snap-y
        snap-mandatory
        bg-background
      "
    >
      {shorts.map((video, index) => (
        <section
          key={video.id}
          className="
            h-full
            min-h-full
            snap-start
            flex
            justify-center
            items-center
          "
        >
          <div
            className="
            relative
            w-full
            max-w-[500px]
            h-[95vh]
            max-h-[900px]
            rounded-3xl
            overflow-hidden
            bg-black
            shadow-2xl
            "
          >
            {/* Load only active video */}
            {index === activeIndex ? (
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=${isMuted ? 1 : 0}&playsinline=1&rel=0`}
                title={video.snippet.title}
                allow="autoplay"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            ) : (
              <>
                <img src={video.snippet.thumbnails.high.url} alt={video.snippet.title} className="absolute inset-0 w-full h-full object-cover" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/40 text-white px-4 py-2 rounded-full">▶ Tap to Play</div>
                </div>
              </>
            )}

            {isMuted && index === activeIndex && (
              <button
                onClick={handleUnmute}
                className="
      absolute
      top-4
      right-4
      z-20
      bg-black/60
      text-white
      px-3
      py-2
      rounded-full
      text-sm
    "
              >
                🔊 Unmute
              </button>
            )}

            {/* Dark overlay */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black/90
                via-black/20
                to-transparent
                pointer-events-none
              "
            />

            {/* Channel + title */}
            <div
              className="
                absolute
                bottom-6
                left-4
                right-20
                z-10
                text-white
              "
            >
              <p className="font-semibold text-sm truncate">@{video.snippet.channelTitle}</p>

              <p className="mt-2 text-sm line-clamp-3">{video.snippet.title}</p>
            </div>

            {/* Action buttons */}
            <div
              className="
                absolute
                right-3
                bottom-8
                z-10
                flex
                flex-col
                items-center
                gap-6
                text-white
              "
            >
              <button className="flex flex-col items-center">
                <HeartIcon className="h-8 w-8" />
                <span className="text-xs mt-1">Like</span>
              </button>

              <button className="flex flex-col items-center">
                <ChatBubbleOvalLeftIcon className="h-8 w-8" />
                <span className="text-xs mt-1">Comment</span>
              </button>

              <button className="flex flex-col items-center">
                <ShareIcon className="h-8 w-8" />
                <span className="text-xs mt-1">Share</span>
              </button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Shorts;
