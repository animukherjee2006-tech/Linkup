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

import LikeListModal from "../components/LikeListModal";

function Home() {
  const API = "https://linkup-144b.onrender.com";

  const [posts, setPosts] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(null);
  const [likeLoading, setLikeLoading] = useState(null);

  const [showLikeModal, setShowLikeModal] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const [likeListLoading, setLikeListLoading] = useState(false);

  // --------------------------------------------------
  // AXIOS CONFIG
  // --------------------------------------------------

  const getConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
  };

  // --------------------------------------------------
  // FETCH POSTS + FOLLOWING
  // --------------------------------------------------

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      const config = getConfig();

      const [postsResponse, followResponse] =
        await Promise.all([
          axios.get(
            `${API}/api/posts/seeposts`,
            config
          ),

          axios.get(
            `${API}/api/followroute/seefollow`,
            config
          ),
        ]);

      const fetchedPosts =
        postsResponse.data?.postss || [];

      setPosts(fetchedPosts);

      setFollowingList(
        followResponse.data?.followingIds || []
      );

      // Check which posts current user liked
      await loadLikedStatus(fetchedPosts);
    } catch (error) {
      console.error(
        "Home Fetch Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // CHECK LIKED STATUS
  // --------------------------------------------------

const loadLikedStatus = async (fetchedPosts) => {
    if (!fetchedPosts || fetchedPosts.length === 0) {
        return;
    }

    try {
        const config = getConfig();

        const results = await Promise.all(
            fetchedPosts.map(async (post) => {
                try {
                    const response = await axios.get(
                        `${API}/api/likeroute/checklike`,
                        {
                            params: {
                                postId: post._id
                            },
                            ...config
                        }
                    );

                    console.log(
                        "Post:",
                        post._id,
                        "Liked:",
                        response.data?.liked
                    );

                    return {
                        postId: post._id,
                        liked: response.data?.liked === true
                    };

                } catch (error) {
                    console.error(
                        "Check like error:",
                        error.response?.data || error.message
                    );

                    return {
                        postId: post._id,
                        liked: false
                    };
                }
            })
        );

        setPosts((currentPosts) =>
            currentPosts.map((post) => {
                const result = results.find(
                    (item) =>
                        String(item.postId) ===
                        String(post._id)
                );

                if (!result) {
                    return post;
                }

                return {
                    ...post,
                    isLiked: result.liked
                };
            })
        );

    } catch (error) {
        console.error(
            "Load liked status error:",
            error
        );
    }
};

  // --------------------------------------------------
  // FOLLOW / UNFOLLOW
  // --------------------------------------------------

  const handleFollowToggle = async (userId) => {
    if (!userId) return;

    try {
      setFollowLoading(userId);

      const response = await axios.post(
        `${API}/api/followroute/follow`,
        {
          userId,
        },
        getConfig()
      );

      const message =
        response.data?.message?.toLowerCase() || "";

      if (message.includes("unfollow")) {
        setFollowingList((prev) =>
          prev.filter(
            (id) => String(id) !== String(userId)
          )
        );
      } else {
        setFollowingList((prev) => {
          const alreadyFollowing = prev.some(
            (id) => String(id) === String(userId)
          );

          if (alreadyFollowing) {
            return prev;
          }

          return [...prev, userId];
        });
      }
    } catch (error) {
      console.error(
        "Follow error:",
        error.response?.data || error.message
      );
    } finally {
      setFollowLoading(null);
    }
  };

  // --------------------------------------------------
  // LIKE / UNLIKE
  // --------------------------------------------------

const handleLike = async (postId) => {
    if (!postId || likeLoading === postId) return;

    const selectedPost = posts.find(
        (post) => post._id === postId
    );

    if (!selectedPost) return;

    const oldLiked = selectedPost.isLiked === true;

    try {
        setLikeLoading(postId);

        // Optimistic UI
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post._id !== postId) {
                    return post;
                }

                return {
                    ...post,
                    isLiked: !oldLiked
                };
            })
        );

        const response = await axios.post(
            `${API}/api/likeroute/getlike`,
            {
                postId
            },
            getConfig()
        );

        const { liked, count } = response.data;

        // Backend final state
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post._id !== postId) {
                    return post;
                }

                return {
                    ...post,
                    isLiked: liked,
                    likeCount: count
                };
            })
        );

    } catch (error) {
        console.error(
            "Like error:",
            error.response?.data || error.message
        );

        // Rollback
        setPosts((prevPosts) =>
            prevPosts.map((post) => {
                if (post._id !== postId) {
                    return post;
                }

                return {
                    ...post,
                    isLiked: oldLiked
                };
            })
        );

    } finally {
        setLikeLoading(null);
    }
};

  // --------------------------------------------------
  // OPEN LIKE LIST
  // --------------------------------------------------

  const openLikeList = async (postId) => {
    if (!postId) return;

    try {
      setShowLikeModal(true);
      setLikeListLoading(true);
      setLikeList([]);

      const response = await axios.get(
        `${API}/api/likeroute/seelike`,
        {
          params: {
            postId,
          },
          ...getConfig(),
        }
      );

      setLikeList(
        response.data?.likes || []
      );
    } catch (error) {
      console.error(
        "Like list error:",
        error.response?.data || error.message
      );

      setLikeList([]);
    } finally {
      setLikeListLoading(false);
    }
  };

  // --------------------------------------------------
  // HELPERS
  // --------------------------------------------------

  const getInitial = (username) => {
    return (
      username?.charAt(0)?.toUpperCase() || "?"
    );
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );
  };

  // --------------------------------------------------
  // LOADING SCREEN
  // --------------------------------------------------

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

                <div className="flex-1 space-y-2">
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

  // --------------------------------------------------
  // MAIN
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <div className="max-w-xl mx-auto px-3 sm:px-4 py-6 sm:py-8">

        {/* PAGE HEADER */}

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

        {/* NO POSTS */}

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
              Follow more people and their latest posts
              will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">

            {posts.map((post) => {
              const userId =
                post.username?._id;

              const username =
                post.username?.username ||
                "user";

              const fullname =
                post.username?.fullname ||
                username;

              const isFollowing =
                followingList.some(
                  (id) =>
                    String(id) ===
                    String(userId)
                );

              const isLiked =
                post.isLiked === true;

              return (
                <article
                  key={post._id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.07)]"
                >

                  {/* USER HEADER */}

                  <div className="px-4 sm:px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">

                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {getInitial(
                            username
                          )}
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
                                {formatDate(
                                  post.createdAt
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* FOLLOW */}

                    <div className="flex items-center gap-1">
                      {userId && (
                        <button
                          type="button"
                          onClick={() =>
                            handleFollowToggle(
                              userId
                            )
                          }
                          disabled={
                            followLoading ===
                            userId
                          }
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isFollowing
                              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                        >
                          {followLoading ===
                          userId ? (
                            <Loader2
                              size={14}
                              className="animate-spin"
                            />
                          ) : isFollowing ? (
                            <>
                              <Check
                                size={14}
                              />
                              Following
                            </>
                          ) : (
                            <>
                              <UserPlus
                                size={14}
                              />
                              Follow
                            </>
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400"
                      >
                        <MoreHorizontal
                          size={19}
                        />
                      </button>
                    </div>
                  </div>

                  {/* POST IMAGE */}

                  {post.mediaurl && (
                    <div className="bg-gray-100 overflow-hidden">
                      <img
                        src={post.mediaurl}
                        alt={
                          post.caption ||
                          "Post"
                        }
                        className="w-full max-h-[620px] object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* POST CONTENT */}

                  <div className="px-4 sm:px-5 pt-4 pb-5">

                    {/* ACTIONS */}

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-1">

                        {/* LIKE BUTTON */}

                        <button
                          type="button"
                          onClick={() =>
                            handleLike(
                              post._id
                            )
                          }
                          disabled={
                            likeLoading ===
                            post._id
                          }
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            isLiked
                              ? "text-red-500 bg-red-50"
                              : "text-gray-500 hover:bg-gray-100 hover:text-red-500"
                          }`}
                        >
                          {likeLoading ===
                          post._id ? (
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

                        <button
                          type="button"
                          onClick={() =>
                            openLikeList(
                              post._id
                            )
                          }
                          className="text-sm font-semibold text-gray-700 px-2 hover:underline"
                        >
                          {post.likeCount ||
                          post.likesCount ||
                          0}
                        </button>

                        {/* COMMENT */}

                        <button
                          type="button"
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition"
                        >
                          <MessageCircle
                            size={21}
                          />
                        </button>

                        {/* SEND */}

                        <button
                          type="button"
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition"
                        >
                          <Send
                            size={20}
                          />
                        </button>
                      </div>

                      {/* BOOKMARK */}

                      <button
                        type="button"
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition"
                      >
                        <Bookmark
                          size={20}
                        />
                      </button>
                    </div>

                    {/* CAPTION */}

                    {post.caption && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-800 leading-relaxed">
                          <span className="font-bold text-gray-900 mr-2">
                            {username}
                          </span>

                          {post.caption}
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* LIKE MODAL */}

      {showLikeModal && (
        <LikeListModal
          likes={likeList}
          loading={likeListLoading}
          onClose={() =>
            setShowLikeModal(false)
          }
        />
      )}
    </div>
  );
}

export default Home;