import React, { useEffect, useState, useRef } from "react";
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
  X,
} from "lucide-react";

function Home() {
  const [posts, setPosts] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(null);

  // LIKE STATES
  const [likedPosts, setLikedPosts] = useState([]);
  const [likeCounts, setLikeCounts] = useState({});
  const [likeUsers, setLikeUsers] = useState({});
  const [likeLoading, setLikeLoading] = useState(null);

  // Long press popup
  const [showLikeUsers, setShowLikeUsers] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const longPressTimer = useRef(null);

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

        // Get likes for every post
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
              console.error("Like fetch error:", error);

              return {
                postId: post._id,
                count: 0,
                likes: [],
              };
            }
          })
        );

        const counts = {};
        const users = {};
        const liked = [];

        const currentUserId = getCurrentUserId(token);

        likeResults.forEach((item) => {
          counts[item.postId] = item.count;
          users[item.postId] = item.likes;

          const userLiked = item.likes.some((like) => {
            const likedUserId = like.user?._id || like.user;

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
        setLikeUsers(users);
        setLikedPosts(liked);
      } catch (err) {
        console.error("Home Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Decode JWT
  const getCurrentUserId = (token) => {
    try {
      if (!token) return null;

      const payload = JSON.parse(atob(token.split(".")[1]));

      return payload._id || payload.id || payload.userId || null;
    } catch (error) {
      return null;
    }
  };

  // =========================
  // LIKE / UNLIKE
  // =========================

  const handleLike = async (postId) => {
    if (!postId || likeLoading === postId) return;

    setLikeLoading(postId);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://linkup-144b.onrender.com/api/like/getlike",
        {
          postId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const liked = response.data.liked;

      // Change heart state
      setLikedPosts((prev) => {
        if (liked) {
          return prev.includes(postId)
            ? prev
            : [...prev, postId];
        }

        return prev.filter((id) => id !== postId);
      });

      // Change count
      setLikeCounts((prev) => ({
        ...prev,
        [postId]: Math.max(
          0,
          (prev[postId] || 0) + (liked ? 1 : -1)
        ),
      }));

      // If unliked, remove current user from local users list
      if (!liked) {
        const currentUserId = getCurrentUserId(token);

        setLikeUsers((prev) => ({
          ...prev,
          [postId]: (prev[postId] || []).filter((like) => {
            const likedUserId = like.user?._id || like.user;

            return (
              likedUserId?.toString() !==
              currentUserId?.toString()
            );
          }),
        }));
      }
    } catch (error) {
      console.error("Like error:", error);
    } finally {
      setLikeLoading(null);
    }
  };

  // =========================
  // LONG PRESS
  // =========================

  const startLongPress = (postId) => {
    longPressTimer.current = setTimeout(() => {
      setSelectedPostId(postId);
      setShowLikeUsers(true);
    }, 600);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // =========================
  // FOLLOW
  // =========================

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

  const getInitial = (username) =>
    username?.charAt(0)?.toUpperCase() || "?";

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // =========================
  // LOADING
  // =========================

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

        {/* HEADER */}
        <div className="mb-7 px-1">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em]">
            LinkUp
          </p>

          <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-1">
            Your Feed
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            See what your connections are sharing.
          </p>
        </div>

        {/* POSTS */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">
            <MessageCircle
              size={34}
              className="mx-auto text-indigo-600"
            />

            <h2 className="text-xl font-bold text-gray-900 mt-6">
              Your feed is quiet
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Follow more people and their latest posts will show up here.
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

              const likeCount =
                likeCounts[post._id] || 0;

              const users =
                likeUsers[post._id] || [];

              return (
                <article
                  key={post._id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  {/* USER */}
                  <div className="px-4 sm:px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-lg">
                        {getInitial(username)}
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">
                          {fullname}
                        </h3>

                        <div className="flex gap-1.5 text-xs text-gray-500">
                          <span>@{username}</span>

                          {post.createdAt && (
                            <>
                              <span>•</span>
                              <span>
                                {formatDate(post.createdAt)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {userId && (
                        <button
                          onClick={() =>
                            handleFollowToggle(userId)
                          }
                          disabled={
                            followLoading === userId
                          }
                          className={`px-3 py-2 rounded-xl text-xs font-bold ${
                            isFollowing
                              ? "bg-gray-100 text-gray-600"
                              : "bg-indigo-600 text-white"
                          }`}
                        >
                          {followLoading === userId ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : isFollowing ? (
                            <>
                              <Check
                                size={14}
                                className="inline mr-1"
                              />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus
                                size={14}
                                className="inline mr-1"
                              />
                              Follow
                            </>
                          )}
                        </button>
                      )}

                      <button className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400">
                        <MoreHorizontal size={19} />
                      </button>
                    </div>
                  </div>

                  {/* IMAGE */}
                  {post.mediaurl && (
                    <div className="bg-gray-100 overflow-hidden">
                      <img
                        src={post.mediaurl}
                        alt={post.caption || "Post"}
                        className="w-full max-h-[620px] object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="px-4 sm:px-5 pt-4 pb-5">
                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-1">

                        {/* INSTAGRAM STYLE LIKE */}
                        <div className="flex flex-col items-start">

                          <button
                            type="button"

                            onClick={() =>
                              handleLike(post._id)
                            }

                            onMouseDown={() =>
                              startLongPress(post._id)
                            }

                            onMouseUp={cancelLongPress}
                            onMouseLeave={cancelLongPress}

                            onTouchStart={() =>
                              startLongPress(post._id)
                            }

                            onTouchEnd={cancelLongPress}
                            onTouchCancel={cancelLongPress}

                            disabled={
                              likeLoading === post._id
                            }

                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-90 ${
                              isLiked
                                ? "text-red-500 bg-red-50"
                                : "text-gray-500 hover:bg-gray-100 hover:text-red-500"
                            }`}
                          >
                            {likeLoading === post._id ? (
                              <Loader2
                                size={22}
                                className="animate-spin"
                              />
                            ) : (
                              <Heart
                                size={23}
                                fill={
                                  isLiked
                                    ? "currentColor"
                                    : "none"
                                }
                                strokeWidth={
                                  isLiked ? 2.5 : 2
                                }
                              />
                            )}
                          </button>

                          {/* COUNT */}
                          {likeCount > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPostId(post._id);
                                setShowLikeUsers(true);
                              }}
                              className="text-xs font-bold text-gray-700 mt-1 hover:underline"
                            >
                              {likeCount}{" "}
                              {likeCount === 1
                                ? "like"
                                : "likes"}
                            </button>
                          )}
                        </div>

                        {/* COMMENT */}
                        <button
                          type="button"
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
                        >
                          <MessageCircle size={21} />
                        </button>

                        {/* SHARE */}
                        <button
                          type="button"
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-indigo-600"
                        >
                          <Send size={20} />
                        </button>
                      </div>

                      {/* BOOKMARK */}
                      <button
                        type="button"
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100"
                      >
                        <Bookmark size={20} />
                      </button>
                    </div>

                    {/* CAPTION */}
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

      {/* ========================= */}
      {/* LIKE USERS POPUP */}
      {/* ========================= */}

      {showLikeUsers && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
          onClick={() => setShowLikeUsers(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* POPUP HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-900">
                Likes
              </h2>

              <button
                onClick={() => setShowLikeUsers(false)}
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
              >
                <X size={19} />
              </button>
            </div>

            {/* USERS */}
            <div className="max-h-[400px] overflow-y-auto">
              {(likeUsers[selectedPostId] || []).length === 0 ? (
                <div className="py-10 text-center text-gray-500 text-sm">
                  No likes yet
                </div>
              ) : (
                (likeUsers[selectedPostId] || []).map(
                  (like) => {
                    const likedUser = like.user;

                    const name =
                      likedUser?.fullname ||
                      likedUser?.name ||
                      "User";

                    const username =
                      likedUser?.username || "user";

                    return (
                      <div
                        key={like._id}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold">
                          {getInitial(username)}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900 text-sm">
                            {name}
                          </p>

                          <p className="text-xs text-gray-500">
                            @{username}
                          </p>
                        </div>
                      </div>
                    );
                  }
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;