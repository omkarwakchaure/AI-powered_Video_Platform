import ButtonList from './buttons/ButtonList';
import VideoContainer from './innerpages/videoCard/VideoContainer';
import React from 'react';

const MainContainer = () => {
  return (
    <div className="flex flex-col w-full min-h-0 flex-1">
      <div className="sticky top-0 z-10 bg-plain border-b border-border shadow-sm rounded">
        <ButtonList />
      </div>
      <VideoContainer />
    </div>
  );
};
export default MainContainer;
