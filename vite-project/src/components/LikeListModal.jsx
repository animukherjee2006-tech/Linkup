import React from "react";
import { Heart, X, Loader2 } from "lucide-react";

function LikeListModal({ likes = [], loading, onClose }) {
  const getUser = (like) => {
    return like?.user || like;
  };

  const getUsername = (like) => {
    const user = getUser(like);

    return (
      user?.username ||
      user?.name ||
      "user"
    );
  };

  const getName = (like) => {
    const user = getUser(like);

    return (
      user?.name ||
      user?.fullname ||
      user?.username ||
      "User"
    );
  };

  const getProfilePic = (like) => {
    const user = getUser(like);

    return user?.profilePic || null;
  };

  const getInitial = (username) => {
    return (
      username?.charAt(0)?.toUpperCase() || "?"
    );
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Likes
            </h2>

            {!loading && (
              <p className="text-xs text-gray-500 mt-0.5">
                {likes.length}{" "}
                {likes.length === 1
                  ? "person"
                  : "people"}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[450px] overflow-y-auto p-3">
          {loading ? (
            <div className="py-14 flex justify-center">
              <Loader2
                size={30}
                className="animate-spin text-indigo-600"
              />
            </div>
          ) : likes.length === 0 ? (
            <div className="py-14 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-red-50 flex items-center justify-center">
                <Heart
                  size={30}
                  className="text-red-400"
                />
              </div>

              <h3 className="font-semibold text-gray-900 mt-4">
                No likes yet
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Be the first one to like this post.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {likes.map((like, index) => {
                const username =
                  getUsername(like);

                const name =
                  getName(like);

                const profilePic =
                  getProfilePic(like);

                return (
                  <div
                    key={
                      like?._id || index
                    }
                    className="flex items-center justify-between px-3 py-3 rounded-2xl hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      {profilePic ? (
                        <img
                          src={profilePic}
                          alt={username}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold">
                          {getInitial(
                            username
                          )}
                        </div>
                      )}

                      {/* User */}
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {name}
                        </p>

                        <p className="text-xs text-gray-500 truncate">
                          @{username}
                        </p>
                      </div>
                    </div>

                    <Heart
                      size={18}
                      fill="currentColor"
                      className="text-red-500 flex-shrink-0"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LikeListModal;