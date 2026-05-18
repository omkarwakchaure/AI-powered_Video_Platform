import React from 'react';

const CommentCard = ({ data }) => {
  const { name, text, avatar } = data;

  return (
    <div className="flex gap-3 bg-background p-3 rounded-xl my-3">
      <img className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0" alt="user" src={avatar} />

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm sm:text-base break-words">{name}</p>

        <p className="text-sm text-text/80 break-words" dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>
  );
};

export default CommentCard;
