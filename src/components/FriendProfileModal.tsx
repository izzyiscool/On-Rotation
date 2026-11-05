import React from 'react';
import { useRotation } from '../context/RotationContext';
import { FriendProfile } from '../types/media';
import { MEDIA_TYPE_CONFIG } from '../utils/mediaUtils';
import { MediaIcon } from './MediaIcon';
import { X, UserPlus, UserCheck, Star, BookmarkPlus, Disc } from 'lucide-react';

export const FriendProfileModal: React.FC = () => {
  const {
    selectedFriendModal,
    setSelectedFriendModal,
    toggleFollowFriend,
    addToMyRotation,
    setSelectedMediaModal,
  } = useRotation();

  if (!selectedFriendModal) return null;

  const friend = selectedFriendModal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-900/90">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Friend Profile
          </span>
          <button
            onClick={() => setSelectedFriendModal(null)}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Hero Profile Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <img
              src={friend.avatar}
              alt={friend.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-amber-400/80 shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xl font-display font-bold text-neutral-100">
                    {friend.name}
                  </h3>
                  <p className="text-xs font-mono text-neutral-400">
                    {friend.handle}
                  </p>
                </div>

                <button
                  onClick={() => toggleFollowFriend(friend.id)}
                  className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all self-center sm:self-auto ${
                    friend.isFollowing
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
                      : 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-sm'
                  }`}
                >
                  {friend.isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 mt-2">
                {friend.bio}
              </p>

              {/* Stats Bar */}
              <div className="flex items-center gap-4 text-xs text-neutral-400 mt-3 pt-3 border-t border-neutral-800">
                <div>
                  <span className="font-mono tabular-nums font-bold text-neutral-200 mr-1">
                    {friend.annualCompletedCount}
                  </span>
                  <span>consumed in 2026</span>
                </div>
                <span aria-hidden="true">·</span>
                <div>
                  <span className="font-mono tabular-nums font-bold text-neutral-200 mr-1">
                    {friend.followersCount}
                  </span>
                  <span>followers</span>
                </div>
                <span aria-hidden="true">·</span>
                <div>
                  <span className="font-mono tabular-nums font-bold text-neutral-200 mr-1">
                    {friend.followingCount}
                  </span>
                  <span>following</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top 4 Favorites Shelf (Letterboxd / Goodreads 4-poster showcase) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-display font-bold text-neutral-100 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span>Top 4 All-Time Favorites</span>
              </h4>
              <span className="text-xs text-neutral-500">Curated by {friend.name.split(' ')[0]}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {friend.topFourFavorites.map(item => {
                const config = MEDIA_TYPE_CONFIG[item.type];
                return (
                  <div
                    key={item.id}
                    className="group relative bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 flex flex-col justify-between"
                  >
                    <div className="aspect-[3/4] w-full relative bg-neutral-900 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MediaIcon type={item.type} className="w-5 h-5 text-amber-400/80" />
                      </div>
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-neutral-950/80 backdrop-blur-sm text-[10px] text-neutral-200 border border-neutral-800 flex items-center gap-1 z-10">
                        <MediaIcon type={item.type} className="w-2.5 h-2.5 text-amber-400" />
                        <span>{config.singular}</span>
                      </div>
                    </div>

                    <div className="p-2 space-y-1">
                      <p className="text-xs font-semibold text-neutral-200 truncate leading-snug">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate">
                        {item.creator}
                      </p>
                      <button
                        onClick={() => addToMyRotation(item, 'up_next')}
                        className="w-full mt-1 py-1 text-[10px] font-semibold text-cyan-400 bg-neutral-900 hover:bg-neutral-800 rounded border border-neutral-800 flex items-center justify-center gap-1 transition-colors"
                      >
                        <BookmarkPlus className="w-3 h-3" />
                        <span>Queue</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Currently On Rotation for this friend */}
          <div className="space-y-3">
            <h4 className="text-sm font-display font-bold text-neutral-100 flex items-center gap-2">
              <Disc className="w-4 h-4 text-amber-400" />
              <span>Currently On Rotation for {friend.name.split(' ')[0]}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {friend.currentlyRotating.map(item => {
                const config = MEDIA_TYPE_CONFIG[item.type];
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800 relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MediaIcon type={item.type} className="w-4 h-4 text-amber-400/80" />
                        </div>
                        <img
                          src={item.coverImage}
                          alt={item.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                          <MediaIcon type={item.type} className="w-3 h-3 text-amber-400" />
                          <span>{config.singular}</span>
                        </span>
                        <h5 className="text-xs font-bold text-neutral-200 truncate">
                          {item.title}
                        </h5>
                        <p className="text-[11px] text-neutral-400 truncate">
                          {item.creator}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => addToMyRotation(item, 'up_next')}
                      className="p-2 text-neutral-400 hover:text-cyan-400 hover:bg-neutral-900 rounded-lg transition-colors shrink-0"
                      title="Add to my backlog"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
