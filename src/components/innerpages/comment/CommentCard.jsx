import React, { useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const CommentCard = ({ data }) => {
  const { name, text, avatar } = data;

  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex gap-3 bg-background p-3 rounded-xl my-3">
      {!avatar || imageError ? (
        <UserCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-text/60 shrink-0" />
      ) : (
        <img className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0 object-cover" alt="user" src={avatar} onError={() => setImageError(true)} />
      )}

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm sm:text-base break-words text-text">{name}</p>

        <p className="text-sm text-text/80 break-words" dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>
  );
};

export default CommentCard;
