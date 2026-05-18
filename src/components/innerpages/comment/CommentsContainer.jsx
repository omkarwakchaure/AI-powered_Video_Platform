import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import CommentList from './CommentList';
import { YOUTUBE_COMMENTS_API } from '../../../utils/constants';

const CommentsContainer = () => {
  const [commentsData, setCommentsData] = useState([]);
  const [searchParams] = useSearchParams();

  const videoId = searchParams.get('v');

  useEffect(() => {
    if (!videoId) return;

    const fetchComments = async () => {
      const res = await fetch(`${YOUTUBE_COMMENTS_API}?videoId=${videoId}`);
      const data = await res.json();

      const formattedComments = data.map((item) => ({
        id: item.id,
        name: item.snippet.topLevelComment.snippet.authorDisplayName,
        text: item.snippet.topLevelComment.snippet.textDisplay,
        avatar: item.snippet.topLevelComment.snippet.authorProfileImageUrl,
        replies:
          item.replies?.comments?.map((reply) => ({
            id: reply.id,
            name: reply.snippet.authorDisplayName,
            text: reply.snippet.textDisplay,
            avatar: reply.snippet.authorProfileImageUrl,
            replies: [],
          })) || [],
      }));

      setCommentsData(formattedComments);
    };

    fetchComments();
  }, [videoId]);

  return (
    <div className="mt-6 max-w-5xl mx-auto px-2 sm:px-4 pb-10">
      <h1 className="text-lg sm:text-2xl font-bold mb-4 text-text">Comments</h1>

      {commentsData.length === 0 ? <p className="text-sm text-text/60">No comments available</p> : <CommentList comments={commentsData} />}
    </div>
  );
};

export default CommentsContainer;
