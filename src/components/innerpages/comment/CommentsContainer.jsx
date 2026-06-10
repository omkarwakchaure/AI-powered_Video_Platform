import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import CommentList from './CommentList';
import { YOUTUBE_COMMENTS_API } from '../../../utils/constants';

const CommentsContainer = ({ scrollRef }) => {
  const [commentsData, setCommentsData] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const videoId = searchParams.get('v');

  const fetchComments = async (pageToken = '') => {
    if (!videoId || loading) return;

    setLoading(true);

    try {
      const separator = YOUTUBE_COMMENTS_API.includes('?') ? '&' : '?';

      const url = pageToken
        ? `${YOUTUBE_COMMENTS_API}${separator}videoId=${videoId}&pageToken=${pageToken}`
        : `${YOUTUBE_COMMENTS_API}${separator}videoId=${videoId}`;

      const res = await fetch(url);

      const data = await res.json();

      // Safety check
      if (!data?.items?.length) {
        console.error('No comments found');
        return;
      }

      const formattedComments = data.items.map((item) => ({
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

      // console.log(formattedComments);

      setCommentsData((prev) => [...prev, ...formattedComments]);

      setNextPageToken(data.nextPageToken || null);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCommentsData([]);
    setNextPageToken(null);

    fetchComments();
  }, [videoId]);

  useEffect(() => {
    const handleScroll = () => {
      const container = scrollRef.current;

      if (!container) return;

      const scrollTop = container.scrollTop;
      const windowHeight = container.clientHeight;
      const fullHeight = container.scrollHeight;

      const nearBottom = scrollTop + windowHeight >= fullHeight - 300;

      if (nearBottom && nextPageToken && !loading) {
        fetchComments(nextPageToken);
      }
    };

    const container = scrollRef.current;

    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [nextPageToken, loading]);

  return (
    <div className="mt-6 max-w-7xl mx-auto px-2 sm:px-4 pb-10">
      <h1 className="text-lg sm:text-2xl font-semibold mb-4 text-text/90">Comments :</h1>

      {commentsData.length === 0 && !loading ? (
        <p className="text-sm text-text/60">No comments available</p>
      ) : (
        <>
          <CommentList comments={commentsData} />

          {loading && <p className="text-center py-4 text-text/60">Loading comments...</p>}
        </>
      )}
    </div>
  );
};

export default CommentsContainer;
