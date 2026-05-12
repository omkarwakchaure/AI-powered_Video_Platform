import ButtonList from './buttons/ButtonList';
import VideoContainer from './innerpages/videoCard/VideoContainer';
import React from 'react';
import { useRef } from 'react';

const MainContainer = () => {
  const scrollRef = useRef(null);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Buttons */}
      <div className="sticky top-0 z-10 bg-plain">
        <div className="p-2">
          <ButtonList />
        </div>

        {/* Divider */}
        <div className="border-b border-border" />
      </div>

      {/* ONLY videos scroll */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto h-full flex flex-col mt-4">
        <VideoContainer scrollRef={scrollRef} />
      </div>
    </div>
  );
};

export default MainContainer;
