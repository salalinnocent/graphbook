import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Post from "../posts/index.js";
import Loading from "../loading.js";

//NEED TO HANDLE ERRORS FOR THE POSTS AND MORE CHATS EFFICIENTLY

//abstracted the feed of posts from our Feed.js file
export default function FeedList({ posts, fetchMore }) {
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    fetchMore({
      variables: { page: page + 1 },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult?.postsFeed?.posts?.length
        ) {
          setHasMore(false);
          return prev;
        }
        setPage((p) => p + 1);
        return {
          postsFeed: {
            _typename: "PostFeed",
            posts: [...prev.postsFeed.posts, ...fetchMoreResult.postsFeed.posts],
          },
        };
      },
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 px-4">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No posts available</p>
      ) : (
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={hasMore}
          loader={
            <div key="loader" className="flex justify-center py-6">
              <Loading />
            </div>
          }
        >
          <div className="space-y-6">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}
