import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router';
import CommentsContainer from '../comment/CommentsContainer';
import { toggleSidebar } from '../../../store/slices/sidebarSlice';

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  return (
    <div ref={scrollContainerRef} className="h-full overflow-y-auto px-2 sm:px-4 lg:px-6 py-4">
      {/* Video */}
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={'https://www.youtube.com/embed/' + searchParams.get('v')}
            title="YouTube video player"
            frameBorder="0"
            allowFullScreen
          />
        </div>
      </div>

      {/* Comments */}
      <CommentsContainer scrollRef={scrollContainerRef} />
    </div>
  );
};

export default WatchPage;
