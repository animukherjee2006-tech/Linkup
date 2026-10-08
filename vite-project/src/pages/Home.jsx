import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  Bookmark,
  UserPlus,
  UserCheck,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Trash2,
  Smile,
} from "lucide-react";

import LikeListModal from "../components/LikeListModal";

function Home() {
  const API = "https://linkup-144b.onrender.com";
  // Updated to match app.use('/api/comment', commentroutes) in app.js
  const COMMENT_API = `${API}/api/comment`;

  const navigate = useNavigate();

  // Core State
  const [posts, setPosts] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  // Loading States
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(null);
  const [likeLoading, setLikeLoading] = useState(null);

  // Like List Modal State
  const [showLikeModal, setShowLikeModal] = useState(false);
  const [likeList, setLikeList] = useState([]);
  const [likeListLoading, setLikeListLoading] = useState(false);

  // Post Detail / Modal Viewer State
  const [selectedPostIndex, setSelectedPostIndex] = useState(null);

  // Comments State for Modal
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [postCommentLoading, setPostCommentLoading] = useState(false);

  // Axios Config
  const getConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    };
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const config = getConfig();

      const [postsRes, followRes, profileRes] = await Promise.allSettled([
        axios.get(`${API}/api/posts/seeposts`, config),
        axios.get(`${API}/api/followroute/seefollow`, config),
        axios.get(`${API}/api/userpost/seeprofile`, config),
      ]);

      let fetchedPosts = [];

      if (postsRes.status === "fulfilled") {
        fetchedPosts = postsRes.value.data?.postss || [];
        setPosts(fetchedPosts);
      }

      if (followRes.status === "fulfilled") {
        setFollowingList(followRes.value.data?.followingIds || []);
      }

      if (profileRes.status === "fulfilled") {
        setCurrentUserId(profileRes.value.data?.userprofile?._id || null);
      }

      if (fetchedPosts.length > 0) {
        await loadLikedStatus(fetchedPosts);
      }
    } catch (error) {
      console.error("Home Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadLikedStatus = async (fetchedPosts) => {
    if (!fetchedPosts || fetchedPosts.length === 0) return;

    try {
      const config = getConfig();

      const results = await Promise.all(
        fetchedPosts.map(async (post) => {
          try {
            const response = await axios.get(`${API}/api/likeroute/checklike`, {
              params: { postId: post._id },
              ...config,
            });

            return {
              postId: post._id,
              liked: response.data?.liked === true,
            };
          } catch (error) {
            return { postId: post._id, liked: false };
          }
        })
      );

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          const result = results.find(
            (item) => String(item.postId) === String(post._id)
          );
          return result ? { ...post, isLiked: result.liked } : post;
        })
      );
    } catch (error) {
      console.error("Load liked status error:", error);
    }
  };

  // --------------------------------------------------
  // FETCH COMMENTS FOR SELECTED POST (/api/comment/seecomments)
  // --------------------------------------------------
  const fetchPostComments = useCallback(async (postId) => {
    if (!postId) return;
    try {
      setCommentsLoading(true);
      const response = await axios.get(`${COMMENT_API}/seecomments`, {
        params: { postId },
        ...getConfig(),
      });
      setComments(response.data?.comments || []);
    } catch (error) {
      console.error("Fetch comments error:", error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [COMMENT_API]);

  useEffect(() => {
    if (selectedPostIndex !== null && posts[selectedPostIndex]) {
      fetchPostComments(posts[selectedPostIndex]._id);
      setCommentText("");
    }
  }, [selectedPostIndex, posts, fetchPostComments]);

  // --------------------------------------------------
  // ADD COMMENT HANDLER (/api/comment/addcomment)
  // --------------------------------------------------
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || selectedPostIndex === null) return;

    const currentPost = posts[selectedPostIndex];
    if (!currentPost) return;

    try {
      setPostCommentLoading(true);

      const response = await axios.post(
        `${COMMENT_API}/addcomment`,
        {
          postId: currentPost._id,
          comment: commentText.trim(),
        },
        getConfig()
      );

      const newComment = response.data?.comment;
      const updatedCount = response.data?.commentsCount;

      if (newComment) {
        setComments((prev) => [newComment, ...prev]);
        setCommentText("");

        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === currentPost._id
              ? { ...post, commentsCount: updatedCount ?? (post.commentsCount || 0) + 1 }
              : post
          )
        );
      }
    } catch (error) {
      console.error("Add comment error:", error);
    } finally {
      setPostCommentLoading(false);
    }
  };

  // --------------------------------------------------
  // DELETE COMMENT HANDLER (/api/comment/deletecomment/:commentId)
  // --------------------------------------------------
  const handleDeleteComment = async (commentId) => {
    if (!commentId || selectedPostIndex === null) return;

    const currentPost = posts[selectedPostIndex];

    try {
      const response = await axios.delete(
        `${COMMENT_API}/deletecomment/${commentId}`,
        getConfig()
      );

      const updatedCount = response.data?.commentsCount;

      setComments((prev) => prev.filter((c) => c._id !== commentId));

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === currentPost._id
            ? { ...post, commentsCount: updatedCount ?? Math.max(0, (post.commentsCount || 1) - 1) }
            : post
        )
      );
    } catch (error) {
      console.error("Delete comment error:", error);
    }
  };

  // --------------------------------------------------
  // NAVIGATION & ACTIONS
  // --------------------------------------------------
  const handleProfileClick = (targetUserId) => {
    if (!targetUserId) return;

    if (currentUserId && String(targetUserId) === String(currentUserId)) {
      navigate("/mainlayout/profile");
    } else {
      navigate(`/mainlayout/otherprofile/${targetUserId}`);
    }
  };

  const handleFollowToggle = async (targetUserId) => {
    if (!targetUserId || followLoading === targetUserId) return;

    try {
      setFollowLoading(targetUserId);

      const response = await axios.post(
        `${API}/api/followroute/follow`,
        { userId: targetUserId },
        getConfig()
      );

      const message = response.data?.message?.toLowerCase() || "";

      if (message.includes("unfollow")) {
        setFollowingList((prev) =>
          prev.filter((id) => String(id) !== String(targetUserId))
        );
      } else {
        setFollowingList((prev) =>
          prev.some((id) => String(id) === String(targetUserId))
            ? prev
            : [...prev, targetUserId]
        );
      }
    } catch (error) {
      console.error("Follow error:", error);
    } finally {
      setFollowLoading(null);
    }
  };

  const handleLike = async (postId) => {
    if (!postId || likeLoading === postId) return;

    const selectedPost = posts.find((post) => post._id === postId);
    if (!selectedPost) return;

    const oldLiked = selectedPost.isLiked === true;
    const oldLikeCount =
      selectedPost.likeCount ?? selectedPost.likesCount ?? 0;

    try {
      setLikeLoading(postId);

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id !== postId) return post;
          return {
            ...post,
            isLiked: !oldLiked,
            likeCount: oldLiked
              ? Math.max(0, oldLikeCount - 1)
              : oldLikeCount + 1,
          };
        })
      );

      const response = await axios.post(
        `${API}/api/likeroute/getlike`,
        { postId },
        getConfig()
      );

      const { liked, count } = response.data;

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id !== postId) return post;
          return {
            ...post,
            isLiked: liked,
            likeCount: typeof count === "number" ? count : oldLikeCount,
          };
        })
      );
    } catch (error) {
      console.error("Like error:", error);

      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post._id !== postId) return post;
          return {
            ...post,
            isLiked: oldLiked,
            likeCount: oldLikeCount,
          };
        })
      );
    } finally {
      setLikeLoading(null);
    }
  };

  const openLikeList = async (postId) => {
    if (!postId) return;

    try {
      setShowLikeModal(true);
      setLikeListLoading(true);
      setLikeList([]);

      const response = await axios.get(`${API}/api/likeroute/seelike`, {
        params: { postId },
        ...getConfig(),
      });

      setLikeList(response.data?.likes || []);
    } catch (error) {
      console.error("Like list error:", error);
      setLikeList([]);
    } finally {
      setLikeListLoading(false);
    }
  };

  const handleNextPost = useCallback(() => {
    if (selectedPostIndex !== null && selectedPostIndex < posts.length - 1) {
      setSelectedPostIndex(selectedPostIndex + 1);
    }
  }, [selectedPostIndex, posts.length]);

  const handlePrevPost = useCallback(() => {
    if (selectedPostIndex !== null && selectedPostIndex > 0) {
      setSelectedPostIndex(selectedPostIndex - 1);
    }
  }, [selectedPostIndex]);

  const handleCloseModal = () => {
    setSelectedPostIndex(null);
    setComments([]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedPostIndex === null) return;

      if (e.key === "ArrowRight") {
        handleNextPost();
      } else if (e.key === "ArrowLeft") {
        handlePrevPost();
      } else if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPostIndex, handleNextPost, handlePrevPost]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50/40 px-4 py-8">
        <div className="max-w-xl mx-auto space-y-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-3xl border border-blue-100 shadow-sm overflow-hidden animate-pulse"
            >
              <div className="p-5 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-100" />
                <div className="flex-1 space-y-2">
                  <div className="w-32 h-3 bg-blue-100 rounded-full" />
                  <div className="w-20 h-2 bg-blue-50 rounded-full" />
                </div>
                <div className="w-20 h-8 bg-blue-100 rounded-full" />
              </div>
              <div className="h-80 bg-blue-50" />
              <div className="p-5 space-y-3">
                <div className="w-32 h-3 bg-blue-100 rounded-full" />
                <div className="w-full h-3 bg-blue-50 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const activePost =
    selectedPostIndex !== null ? posts[selectedPostIndex] : null;

  const activeUserObj =
    activePost && typeof activePost.username === "object"
      ? activePost.username
      : null;
  const activeUserId =
    activeUserObj?._id || activePost?.user || activePost?.userId;
  const activeUsername = activeUserObj?.username || "user";
  const activeFullname = activeUserObj?.fullname || activeUsername;
  const activeProfilePic = activeUserObj?.profilePic;
  const activeIsFollowing = followingList.some(
    (id) => String(id) === String(activeUserId)
  );

  return (
    <div className="min-h-screen bg-blue-50/40 text-slate-800 selection:bg-blue-500 selection:text-white">
      <div className="max-w-xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* HEADER */}
        <header className="mb-7 px-1">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-[0.2em]">
            LinkUp
          </p>

          <div className="flex items-end justify-between mt-1">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                Your Feed
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                See what your connections are sharing.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-blue-100 shadow-sm">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-slate-600">Live</span>
            </div>
          </div>
        </header>

        {/* POSTS LIST */}
        {posts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-blue-100 shadow-sm p-10 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 flex items-center justify-center">
              <MessageCircle size={34} className="text-blue-600" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 mt-6">
              Your feed is quiet
            </h2>

            <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2 leading-relaxed">
              Follow more people and their latest posts will show up here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post, index) => {
              const userObj =
                typeof post.username === "object" ? post.username : null;
              const targetUserId =
                userObj?._id || post.user || post.userId;
              const username = userObj?.username || "user";
              const fullname = userObj?.fullname || username;
              const profilePic = userObj?.profilePic;

              const likeCount =
                post.likeCount ?? post.likesCount ?? 0;

              const isFollowing = followingList.some(
                (id) => String(id) === String(targetUserId)
              );
              const isSelf =
                currentUserId && String(targetUserId) === String(currentUserId);
              const isLiked = post.isLiked === true;

              return (
                <article
                  key={post._id || index}
                  className="bg-white rounded-3xl border border-blue-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                >
                  {/* USER HEADER */}
                  <div className="px-4 sm:px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        onClick={() => handleProfileClick(targetUserId)}
                        className="relative flex-shrink-0 cursor-pointer group"
                      >
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 via-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden group-hover:opacity-90 transition">
                          {profilePic ? (
                            <img
                              src={profilePic}
                              alt={username}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            getInitials(fullname || username)
                          )}
                        </div>
                        <span className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-white" />
                      </div>

                      <div className="min-w-0">
                        <h3
                          onClick={() => handleProfileClick(targetUserId)}
                          className="font-bold text-slate-900 text-sm truncate cursor-pointer hover:text-blue-600 transition"
                        >
                          {fullname}
                        </h3>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            onClick={() => handleProfileClick(targetUserId)}
                            className="text-xs text-slate-500 truncate cursor-pointer hover:underline"
                          >
                            @{username}
                          </span>

                          {post.createdAt && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-[11px] text-slate-400">
                                {formatDate(post.createdAt)}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {targetUserId && !isSelf && (
                        <button
                          type="button"
                          onClick={() => handleFollowToggle(targetUserId)}
                          disabled={followLoading === targetUserId}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isFollowing
                              ? "bg-blue-50 text-slate-600 border border-blue-100 hover:bg-blue-100"
                              : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                          }`}
                        >
                          {followLoading === targetUserId ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : isFollowing ? (
                            <>
                              <UserCheck size={14} />
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
                        className="w-9 h-9 rounded-xl hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition"
                      >
                        <MoreHorizontal size={19} />
                      </button>
                    </div>
                  </div>

                  {/* POST MEDIA */}
                  {post.mediaurl && (
                    <div
                      onClick={() => setSelectedPostIndex(index)}
                      className="block w-full bg-slate-950 overflow-hidden cursor-pointer"
                    >
                      <img
                        src={post.mediaurl}
                        alt={post.caption || "Post media"}
                        className="w-full max-h-[620px] object-cover transition-transform duration-300 hover:scale-[1.01]"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* POST CONTENT */}
                  <div className="px-4 sm:px-5 pt-4 pb-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleLike(post._id)}
                          disabled={likeLoading === post._id}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            isLiked
                              ? "text-red-500 bg-red-50"
                              : "text-slate-500 hover:bg-blue-50 hover:text-red-500"
                          }`}
                        >
                          {likeLoading === post._id ? (
                            <Loader2 size={21} className="animate-spin" />
                          ) : (
                            <Heart
                              size={21}
                              fill={isLiked ? "currentColor" : "none"}
                            />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => openLikeList(post._id)}
                          className="text-sm font-bold text-slate-800 px-2 hover:text-blue-600 hover:underline transition"
                        >
                          {likeCount}
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedPostIndex(index)}
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          <MessageCircle size={21} />
                        </button>

                        <button
                          type="button"
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"
                        >
                          <Send size={20} />
                        </button>
                      </div>

                      <button
                        type="button"
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <Bookmark size={20} />
                      </button>
                    </div>

                    {post.caption && (
                      <div className="mt-3">
                        <p className="text-sm text-slate-700 leading-relaxed">
                          <span
                            onClick={() => handleProfileClick(targetUserId)}
                            className="font-bold text-slate-900 mr-2 cursor-pointer hover:text-blue-600 transition"
                          >
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

      {/* INSTAGRAM STYLE POST & COMMENTS MODAL */}
      {selectedPostIndex !== null && activePost && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6">
          <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 text-white hover:text-blue-200 p-2 z-50 transition"
            aria-label="Close"
          >
            <X size={28} />
          </button>

          {selectedPostIndex > 0 && (
            <button
              onClick={handlePrevPost}
              className="absolute left-2 sm:left-6 text-blue-600 bg-white/90 hover:bg-white p-2 rounded-full z-50 shadow-md transition"
              aria-label="Previous Post"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {selectedPostIndex < posts.length - 1 && (
            <button
              onClick={handleNextPost}
              className="absolute right-2 sm:right-6 text-blue-600 bg-white/90 hover:bg-white p-2 rounded-full z-50 shadow-md transition"
              aria-label="Next Post"
            >
              <ChevronRight size={28} />
            </button>
          )}

          <div
            className="bg-white border border-blue-100 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Media */}
            <div className="flex-1 bg-slate-950 flex items-center justify-center min-h-[300px] md:min-h-[500px] max-h-[60vh] md:max-h-[85vh]">
              {activePost.mediaurl ? (
                <img
                  src={activePost.mediaurl}
                  alt={activePost.caption || "Selected post"}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="p-8 text-center max-w-md bg-gradient-to-tr from-blue-600 to-indigo-700 w-full h-full flex items-center justify-center">
                  <p className="text-lg sm:text-xl font-medium text-white leading-relaxed">
                    "{activePost.caption}"
                  </p>
                </div>
              )}
            </div>

            {/* Right: Info, Instagram Comments List & Input */}
            <div className="w-full md:w-[420px] border-t md:border-t-0 md:border-l border-blue-100 flex flex-col justify-between bg-white">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => {
                      handleCloseModal();
                      handleProfileClick(activeUserId);
                    }}
                    className="w-9 h-9 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 overflow-hidden cursor-pointer"
                  >
                    {activeProfilePic ? (
                      <img
                        src={activeProfilePic}
                        alt={activeUsername}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(activeFullname || activeUsername)
                    )}
                  </div>
                  <div>
                    <h4
                      onClick={() => {
                        handleCloseModal();
                        handleProfileClick(activeUserId);
                      }}
                      className="font-bold text-xs text-slate-900 cursor-pointer hover:text-blue-600 transition"
                    >
                      {activeUsername}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {activeFullname || ""}
                    </p>
                  </div>
                </div>

                {activeUserId &&
                  currentUserId &&
                  String(activeUserId) !== String(currentUserId) && (
                    <button
                      type="button"
                      onClick={() => handleFollowToggle(activeUserId)}
                      disabled={followLoading === activeUserId}
                      className={`text-xs font-bold px-3 py-1 rounded-lg transition ${
                        activeIsFollowing
                          ? "text-slate-600 bg-blue-50 hover:bg-red-50 hover:text-red-600"
                          : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                      }`}
                    >
                      {activeIsFollowing ? "Following" : "Follow"}
                    </button>
                  )}
              </div>

              {/* INSTAGRAM COMMENTS CONTAINER */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4 max-h-[380px]">
                {/* Author Caption Row */}
                {activePost.caption && (
                  <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                    <div
                      onClick={() => {
                        handleCloseModal();
                        handleProfileClick(activeUserId);
                      }}
                      className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-blue-600 overflow-hidden cursor-pointer mt-0.5"
                    >
                      {activeProfilePic ? (
                        <img
                          src={activeProfilePic}
                          alt={activeUsername}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(activeFullname || activeUsername)
                      )}
                    </div>
                    <div className="text-xs leading-relaxed">
                      <span
                        onClick={() => {
                          handleCloseModal();
                          handleProfileClick(activeUserId);
                        }}
                        className="font-bold text-slate-900 mr-2 cursor-pointer hover:text-blue-600 transition"
                      >
                        {activeUsername}
                      </span>
                      <span className="text-slate-700">{activePost.caption}</span>
                    </div>
                  </div>
                )}

                {/* Comments List */}
                {commentsLoading ? (
                  <div className="py-8 flex justify-center text-blue-600">
                    <Loader2 size={22} className="animate-spin" />
                  </div>
                ) : comments.length > 0 ? (
                  comments.map((item) => {
                    const cUser = item.user;
                    const isMyComment =
                      currentUserId &&
                      String(cUser?._id) === String(currentUserId);

                    return (
                      <div
                        key={item._id}
                        className="flex items-start justify-between gap-2 group text-xs py-1"
                      >
                        <div className="flex items-start gap-2.5">
                          <div
                            onClick={() => {
                              handleCloseModal();
                              handleProfileClick(cUser?._id);
                            }}
                            className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-blue-600 overflow-hidden cursor-pointer mt-0.5"
                          >
                            {cUser?.profilePic ? (
                              <img
                                src={cUser.profilePic}
                                alt={cUser.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              getInitials(cUser?.fullname || cUser?.username)
                            )}
                          </div>
                          <div>
                            <p className="text-slate-800 leading-relaxed">
                              <span
                                onClick={() => {
                                  handleCloseModal();
                                  handleProfileClick(cUser?._id);
                                }}
                                className="font-bold text-slate-900 mr-1.5 cursor-pointer hover:text-blue-600 transition"
                              >
                                {cUser?.username || "user"}
                              </span>
                              {item.comment}
                            </p>

                            <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-medium">
                              <span>{formatDate(item.createdAt)}</span>
                              <button className="hover:text-slate-600 transition">Reply</button>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button className="text-slate-400 hover:text-red-500 transition">
                            <Heart size={12} />
                          </button>

                          {isMyComment && (
                            <button
                              onClick={() => handleDeleteComment(item._id)}
                              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition p-1"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No comments yet. Start the conversation!
                  </p>
                )}
              </div>

              {/* Actions & Add Comment Form */}
              <div className="border-t border-blue-100 p-4 space-y-3 bg-blue-50/20">
                <div className="flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(activePost._id)}
                      className="hover:text-blue-600 transition"
                    >
                      <Heart
                        size={22}
                        className={activePost.isLiked ? "fill-red-500 text-red-500" : ""}
                      />
                    </button>
                    <button className="hover:text-blue-600 transition">
                      <MessageCircle size={22} />
                    </button>
                    <button className="hover:text-blue-600 transition">
                      <Share2 size={22} />
                    </button>
                  </div>
                  <button className="hover:text-blue-600 transition">
                    <Bookmark size={22} />
                  </button>
                </div>

                <div className="text-xs font-bold text-slate-900">
                  {activePost.likeCount ?? activePost.likesCount ?? 0} likes
                </div>

                {/* Comment Input Form */}
                <form
                  onSubmit={handleAddComment}
                  className="pt-2 border-t border-blue-100 flex items-center gap-2"
                >
                  <Smile size={18} className="text-slate-400 cursor-pointer hover:text-slate-600" />
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="bg-transparent text-xs text-slate-800 focus:outline-none flex-1 placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim() || postCommentLoading}
                    className="text-blue-600 font-bold text-xs hover:text-blue-700 transition disabled:opacity-40"
                  >
                    {postCommentLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Post"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIKE LIST MODAL */}
      {showLikeModal && (
        <LikeListModal
          likes={likeList}
          loading={likeListLoading}
          onClose={() => setShowLikeModal(false)}
        />
      )}
    </div>
  );
}

export default Home;