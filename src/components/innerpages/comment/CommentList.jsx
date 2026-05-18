import React from 'react';
import CommentCard from './CommentCard';

const CommentList = ({ comments }) => {
  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id}>
          <CommentCard data={comment} />

          {comment.replies.length > 0 && (
            <div className="pl-3 sm:pl-6 ml-2 sm:ml-4 border-l border-border">
              <CommentList comments={comment.replies} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
