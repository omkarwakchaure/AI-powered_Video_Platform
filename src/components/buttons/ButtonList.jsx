import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import Button from './Button';
import { list } from '../config/button';

const ButtonList = () => {
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const updateVisibility = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;

    setShowLeft(scrollLeft > 0);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollStep = container.offsetWidth * 0.8;

    container.scrollTo({
      left: direction === 'right' ? container.scrollLeft + scrollStep : container.scrollLeft - scrollStep,
      behavior: 'smooth',
    });

    // wait for smooth scroll to update state
    setTimeout(updateVisibility, 300);
  };

  useEffect(() => {
    updateVisibility();
  }, []);

  return (
    <div className="relative flex items-center w-full overflow-hidden py-3">
      {/* Left arrow */}
      {showLeft && (
        <button onClick={() => scroll('left')} className="absolute left-2 z-10 bg-plain shadow-md rounded-full p-2 hover:bg-background cursor-pointer">
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
      )}

      {/* Buttons container */}
      <div className="overflow-hidden w-full px-4">
        <div ref={scrollRef} className="flex flex-nowrap gap-3 overflow-x-auto scroll-smooth scrollbar-hide" onScroll={updateVisibility}>
          {list.map((item) => (
            <Button key={item} buttonName={item} />
          ))}
        </div>
      </div>

      {/* Right arrow */}
      {showRight && (
        <button onClick={() => scroll('right')} className="absolute right-2 z-10 bg-plain shadow-md rounded-full p-2 hover:bg-background cursor-pointer">
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default ButtonList;
