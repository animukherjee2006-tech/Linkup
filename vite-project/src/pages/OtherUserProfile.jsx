import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  MoreHorizontal,
  UserPlus,
  UserCheck,
  Grid3X3,
  Image as ImageIcon,
  Loader2,
  Users,
} from "lucide-react";

const OtherUserProfile = () => {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        };

        const [profileRes, followRes] = await Promise.all([
          axios.get(
            `https://linkup-144b.onrender.com/api/userpost/seeanyprofile/${id}`,
            config
          ),
          axios.get(
            "https://linkup-144b.onrender.com/api/followroute/seefollow",
            config
          ),
        ]);

        const profile = profileRes.data.user;

        setUser(profile);
        setUserPosts(profileRes.data.userPosts || []);

        setFollowersCount(followRes.data.followersCount || 0);
        setFollowingCount(followRes.data.followingCount || 0);

        setIsFollowing(
          followRes.data.followingIds?.includes(profile?._id) || false
        );
      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  const handleFollowToggle = async () => {
    if (!user || followLoading) return;

    setFollowLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://linkup-144b.onrender.com/api/followroute/follow",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const message = response.data.message?.toLowerCase() || "";

      if (message.includes("unfollowed")) {
        setIsFollowing(false);
        setFollowersCount((prev) => Math.max(0, prev - 1));
      } else {
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Follow error:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-11 h-11 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
          <p className="text-sm text-gray-500 font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center px-5">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-white shadow-sm flex items-center justify-center">
            <Users size={32} className="text-gray-400" />
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-5">
            User not found
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            This profile may no longer be available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <div className="max-w-5xl mx-auto px-3 sm:px-5 py-4 sm:py-7">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
          >
            <ArrowLeft size={20} />
          </button>

          <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50 transition">
            <MoreHorizontal size={20} />
          </button>
        </div>

        <section className="bg-white rounded-[28px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="h-32 sm:h-44 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.15),transparent_30%)]" />
          </div>

          <div className="px-5 sm:px-8 pb-7">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
              <div className="-mt-12 sm:-mt-14">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[30px] bg-gradient-to-br from-indigo-500 to-violet-600 border-[5px] border-white shadow-xl flex items-center justify-center text-white font-black text-2xl sm:text-3xl">
                  {getInitials(user.fullname || user.username)}
                </div>
              </div>

              <button
                type="button"
                onClick={handleFollowToggle}
                disabled={followLoading}
                className={`sm:mb-1 px-6 py-3 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  isFollowing
                    ? "bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                }`}
              >
                {followLoading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : isFollowing ? (
                  <>
                    <UserCheck size={17} />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus size={17} />
                    Follow
                  </>
                )}
              </button>
            </div>

            <div className="mt-4">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                {user.fullname || user.username}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                @{user.username}
              </p>

              {user.bio && (
                <p className="text-sm text-gray-600 mt-4 max-w-xl leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>

            <div className="flex items-center gap-7 sm:gap-10 mt-6">
              <div>
                <p className="text-xl font-black text-gray-900">
                  {userPosts.length}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Posts
                </p>
              </div>

              <div>
                <p className="text-xl font-black text-gray-900">
                  {followersCount}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Followers
                </p>
              </div>

              <div>
                <p className="text-xl font-black text-gray-900">
                  {followingCount}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Following
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-7">
          <div className="flex items-center justify-between px-1 mb-4">
            <div className="flex items-center gap-2">
              <Grid3X3 size={17} className="text-indigo-600" />
              <h2 className="font-bold text-gray-900">
                Posts
              </h2>
            </div>

            <span className="text-xs text-gray-400">
              {userPosts.length} shared
            </span>
          </div>

          {userPosts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              {userPosts.map((post) => (
                <div
                  key={post._id}
                  className="group relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm"
                >
                  {post.mediatype !== "text" && post.mediaurl ? (
                    <>
                      <img
                        src={post.mediaurl}
                        alt={post.caption || "User post"}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {post.caption && (
                        <div className="absolute left-4 right-4 bottom-4 text-white text-xs font-medium line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {post.caption}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full p-5 flex items-center justify-center text-center bg-gradient-to-br from-indigo-50 to-violet-50">
                      <div>
                        <div className="w-10 h-10 mx-auto rounded-xl bg-white shadow-sm flex items-center justify-center mb-3">
                          <ImageIcon
                            size={18}
                            className="text-indigo-500"
                          />
                        </div>

                        <p className="text-xs sm:text-sm font-medium text-indigo-900 leading-relaxed line-clamp-6">
                          {post.caption || "A shared thought"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 px-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center">
                <ImageIcon
                  size={27}
                  className="text-gray-400"
                />
              </div>

              <h3 className="font-bold text-gray-800 mt-5">
                No posts yet
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                {user.username} hasn't shared anything yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default OtherUserProfile;