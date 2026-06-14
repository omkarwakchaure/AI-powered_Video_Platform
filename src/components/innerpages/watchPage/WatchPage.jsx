import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router';
import CommentsContainer from '../comment/CommentsContainer';
import { toggleSidebar } from '../../../store/slices/sidebarSlice';
import ShimmerBlock from '../../commonFiles/ShimmerBlock';

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const scrollContainerRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  // Reset loading state when video changes
  useEffect(() => {
    setVideoLoaded(false);
  }, [searchParams.get('v')]);

  return (
    <div ref={scrollContainerRef} className="h-full overflow-y-auto px-2 sm:px-4 lg:px-6 py-4">
      {/* Video + Actions */}
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
          {!videoLoaded && <ShimmerBlock className="absolute top-0 left-0 w-full h-full" />}
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={'https://www.youtube.com/embed/' + searchParams.get('v')}
            title="YouTube video player"
            frameBorder="0"
            allowFullScreen
            onLoad={() => setVideoLoaded(true)}
          />
        </div>

        <div className="flex justify-end mt-3">
          <button
            onClick={() => navigate(`/ai-summary/${searchParams.get('v')}`)}
            className="
            px-4 py-2
            bg-primary/80
            text-plain
            rounded-lg
            hover:bg-primary/90
            cursor-pointer
            text-sm sm:text-base
            whitespace-nowrap
            "
          >
            ✨ AI Summary
          </button>
        </div>
      </div>

      {/* Comments */}
      <CommentsContainer scrollRef={scrollContainerRef} />
    </div>
  );
};

export default WatchPage;
