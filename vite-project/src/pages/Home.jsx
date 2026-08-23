import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  Bookmark,
  UserPlus,
  Check,
  Loader2,
} from "lucide-react";

function Home() {
  const [posts, setPosts] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(null);

  // Like states
  const [likedPosts, setLikedPosts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likeLoading, setLikeLoading] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        const [postsRes, followRes] = await Promise.all([
          axios.get(
            "https://linkup-144b.onrender.com/api/posts/seeposts",
            config
          ),

          axios.get(
            "https://linkup-144b.onrender.com/api/followroute/seefollow",
            config
          ),
        ]);

        const fetchedPosts = postsRes.data.postss || [];

        setPosts(fetchedPosts);
        setFollowingList(followRes.data.followingIds || []);

        // Fetch likes for all posts
        if (fetchedPosts.length > 0) {
          const likeResults = await Promise.all(
            fetchedPosts.map(async (post) => {
              try {
                const response = await axios.get(
                  `https://linkup-144b.onrender.com/api/like/seelike?postId=${post._id}`,
                  config
                );

                return {
                  postId: post._id,
                  count: response.data.count || 0,
                  likes: response.data.likes || [],
                };
              } catch (error) {
                console.error(
                  `Like fetch error for post ${post._id}:`,
                  error
                );

                return {
                  postId: post._id,
                  count: 0,
                  likes: [],
                };
              }
            })
          );

          const counts = {};
          const liked = [];

          likeResults.forEach((item) => {
            counts[item.postId] = item.count;

            // Check whether current logged-in user liked this post
            const currentUserId = getCurrentUserIdFromToken(token);

            const userLiked = item.likes.some((like) => {
              const likedUserId =
                like.user?._id || like.user;

              return (
                likedUserId &&
                currentUserId &&
                likedUserId.toString() === currentUserId.toString()
              );
            });

            if (userLiked) {
              liked.push(item.postId);
            }
          });

          setLikeCounts(counts);
          setLikedPosts(liked);
        }
      } catch (err) {
        console.error("Home Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Get logged-in user's ID from JWT
  const getCurrentUserIdFromToken = (token) => {
    try {
      if (!token) return null;

      const payload = JSON.parse(atob(token.split(".")[1]));

      return payload._id || payload.id || payload.userId || null;
    } catch (error) {
      console.error("Token decode error:", error);
      return null;
    }
  };

  const handleFollowToggle = async (targetUserId) => {
    if (!targetUserId) return;

    setFollowLoading(targetUserId);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://linkup-144b.onrender.com/api/followroute/follow",
        {
          userId: targetUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const message = response.data.message?.toLowerCase() || "";

      if (message.includes("unfollowed")) {
        setFollowingList((prev) =>
          prev.filter((id) => id !== targetUserId)
        );
      } else {
        setFollowingList((prev) =>
          prev.includes(targetUserId)
            ? prev
            : [...prev, targetUserId]
        );
      }
    } catch (err) {
      console.error("Follow error:", err);
    } finally {
      setFollowLoading(null);
    }
  };

  // LIKE / UNLIKE
  const handleLike = async (postId) => {
    if (!postId) return;

    // Prevent multiple requests at the same time
    if (likeLoading === postId) return;

    setLikeLoading(postId);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://linkup-144b.onrender.com/api/like/getlike",
        {
          postId: postId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const isLiked = response.data.liked;

      // Update liked state
      setLikedPosts((prev) => {
        if (isLiked) {
          return prev.includes(postId)
            ? prev
            : [...prev, postId];
        }

        return prev.filter((id) => id !== postId);
      });

      // Update count
      setLikeCounts((prev) => {
        const currentCount = prev[postId] || 0;

        return {
          ...prev,
          [postId]: isLiked
            ? currentCount + 1
            : Math.max(0, currentCount - 1),
        };
      });
    } catch (err) {
      console.error("Like error:", err);

      if (err.response) {
        console.error("Backend response:", err.response.data);
      }
    } finally {
      setLikeLoading(null);
    }
  };

  const getInitial = (username) =>
    username?.charAt(0)?.toUpperCase() || "?";

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] px-4 py-8">
        <div className="max-w-xl mx-auto space-y-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-pulse"
            >
              <div className="p-5 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gray-200" />

                <div className="space-y-2 flex-1">
                  <div className="w-32 h-3 bg-gray-200 rounded-full" />
                  <div className="w-20 h-2 bg-gray-100 rounded-full" />
                </div>

                <div className="w-20 h-8 bg-gray-200 rounded-full" />
              </div>

              <div className="h-80 bg-gray-200" />

              <div className="p-5 space-y-3">
                <div className="w-32 h-3 bg-gray-200 rounded-full" />
                <div className="w-full h-3 bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <div className="max-w-xl mx-auto px-3 sm:px-4 py-6 sm:py-8">

        {/* Header */}
        <div className="mb-7 px-1">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em]">
            LinkUp
          </p>

          <div className="flex items-end justify-between mt-1">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                Your Feed
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                See what your connections are sharing.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />

              <span className="text-xs font-semibold text-gray-600">
                Live
              </span>
            </div>
          </div>
        </div>

        {/* Empty Feed */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 flex items-center justify-center">
              <MessageCircle
                size={34}
                className="text-indigo-600"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-6">
              Your feed is quiet
            </h2>

            <p className="text-sm text-gray-500 max-w-xs mx-auto mt-2 leading-relaxed">
              Follow more people and their latest posts will show up
              here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => {
              const userId = post.username?._id;

              const username =
                post.username?.username || "user";

              const fullname =
                post.username?.fullname || username;

              const isFollowing =
                followingList.includes(userId);

              const isLiked =
                likedPosts.includes(post._id);

              const currentLikeCount =
                likeCounts[post._id] || 0;

              const isLikeLoading =
                likeLoading === post._id;

              return (
                <article
                  key={post._id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.07)]"
                >
                  {/* User Header */}
                  <div className="px-4 sm:px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {getInitial(username)}
                        </div>

                        <span className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-white" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 text-sm truncate">
                          {fullname}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs text-gray-500 truncate">
                            @{username}
                          </span>

                          {post.createdAt && (
                            <>
                              <span className="text-gray-300">
                                •
                              </span>

                              <span className="text-[11px] text-gray-400">
                                {formatDate(post.createdAt)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Follow + More */}
                    <div className="flex items-center gap-1">
                      {userId && (
                        <button
                          type="button"
                          onClick={() =>
                            handleFollowToggle(userId)
                          }
                          disabled={
                            followLoading === userId
                          }
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isFollowing
                              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200"
                          }`}
                        >
                          {followLoading === userId ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : isFollowing ? (
                            <>
                              <Check size={14} />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus size={14} />
                              Follow
                            </>
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 transition"
                      >
                        <MoreHorizontal size={19} />
                      </button>
                    </div>
                  </div>

                  {/* Post Image */}
                  {post.mediaurl && (
                    <div className="relative bg-gray-100 overflow-hidden">
                      <img
                        src={post.mediaurl}
                        alt={post.caption || "Post"}
                        className="w-full max-h-[620px] object-cover transition-transform duration-500 hover:scale-[1.01]"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="px-4 sm:px-5 pt-4 pb-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">

                        {/* LIKE BUTTON */}
                        <div className="flex flex-col items-center">
                          <button
                            type="button"
                            onClick={() =>
                              handleLike(post._id)
                            }
                            disabled={isLikeLoading}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                              isLiked
                                ? "text-red-500 bg-red-50"
                                : "text-gray-500 hover:bg-gray-100 hover:text-red-500"
                            }`}
                          >
                            {isLikeLoading ? (
                              <Loader2
                                size={21}
                                className="animate-spin"
                              />
                            ) : (
                              <Heart
                                size={21}
                                fill={
                                  isLiked
                                    ? "currentColor"
                                    : "none"
                                }
                              />
                            )}
                          </button>

                          {/* LIKE COUNT */}
                          {currentLikeCount > 0 && (
                            <span className="text-xs font-semibold text-gray-600 mt-0.5">
                              {currentLikeCount}
                            </span>
                          )}
                        </div>

                        {/* COMMENT */}
                        <button
                          type="button"
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition"
                        >
                          <MessageCircle size={21} />
                        </button>

                        {/* SHARE */}
                        <button
                          type="button"
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition"
                        >
                          <Send size={20} />
                        </button>
                      </div>

                      {/* BOOKMARK */}
                      <button
                        type="button"
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition"
                      >
                        <Bookmark size={20} />
                      </button>
                    </div>

                    {/* Caption */}
                    <div className="mt-3">
                      <p className="text-sm text-gray-800 leading-relaxed">
                        <span className="font-bold text-gray-900 mr-2">
                          {username}
                        </span>

                        {post.caption}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;