import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router';
import CommentsContainer from '../comment/CommentsContainer';
import { toggleSidebar } from '../../../store/slices/sidebarSlice';
import { useNavigate } from 'react-router';

const WatchPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const scrollContainerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  return (
    <div ref={scrollContainerRef} className="h-full overflow-y-auto px-2 sm:px-4 lg:px-6 py-4">
      {/* Video + Actions */}
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
