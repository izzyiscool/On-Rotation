import React, { useState } from 'react';
import { useRotation } from '../context/RotationContext';
import { SocialActivity } from '../types/media';
import { MEDIA_TYPE_CONFIG } from '../utils/mediaUtils';
import { MediaIcon } from './MediaIcon';
import {
  Heart,
  MessageSquare,
  BookmarkPlus,
  Share2,
  Star,
  Sparkles,
  Send,
  Users,
  Check,
} from 'lucide-react';

export const SocialFeed: React.FC = () => {
  const {
    socialFeed,
    friends,
    toggleLikeActivity,
    addCommentToActivity,
    addToMyRotation,
    setSelectedFriendModal,
    setSelectedMediaModal,
  } = useRotation();

  const [filterMode, setFilterMode] = useState<'all' | 'following' | 'reviews'>('all');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [addedItemNotices, setAddedItemNotices] = useState<Record<string, boolean>>({});

  const followingIds = new Set(friends.filter(f => f.isFollowing).map(f => f.id));
  followingIds.add('current-user');

  const filteredFeed = socialFeed.filter(activity => {
    if (filterMode === 'following' && !followingIds.has(activity.userId)) {
      return false;
    }
    if (filterMode === 'reviews' && activity.activityType !== 'completed_review') {
      return false;
    }
    return true;
  });

  const handleAddComment = (activityId: string) => {
    const text = commentInputs[activityId]?.trim();
    if (!text) return;
    addCommentToActivity(activityId, text);
    setCommentInputs(prev => ({ ...prev, [activityId]: '' }));
  };

  const handleQueueFromFeed = (activity: SocialActivity) => {
    addToMyRotation(activity.mediaItem, 'up_next');
    setAddedItemNotices(prev => ({ ...prev, [activity.id]: true }));
    setTimeout(() => {
      setAddedItemNotices(prev => ({ ...prev, [activity.id]: false }));
    }, 2500);
  };

  const openFriend = (userId: string) => {
    const friend = friends.find(f => f.id === userId);
    if (friend) {
      setSelectedFriendModal(friend);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Feed Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wide">
            <Users className="w-3.5 h-3.5" />
            <span>Circle Feed</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400 font-normal lowercase">What your network is consuming</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 tracking-tight mt-1">
            Social Rotation
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Track your friends' active books, shows, games, and vinyl spins. Discover recommendations directly from their progress.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterMode === 'all'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilterMode('following')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterMode === 'following'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Following
          </button>
          <button
            onClick={() => setFilterMode('reviews')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              filterMode === 'reviews'
                ? 'bg-neutral-800 text-white shadow-sm font-semibold'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Reviews Only
          </button>
        </div>
      </div>

      {/* Suggested Friends Bar */}
      <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-neutral-300">People You Might Like</span>
          <span className="text-neutral-500">Shared entertainment tastes</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {friends.map(friend => (
            <div
              key={friend.id}
              onClick={() => setSelectedFriendModal(friend)}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800/80 cursor-pointer transition-all group"
            >
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-neutral-700 group-hover:ring-amber-400"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-neutral-200 group-hover:text-amber-300 truncate">
                  {friend.name}
                </p>
                <p className="text-[11px] text-neutral-400 truncate">
                  {friend.bio.slice(0, 36)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="space-y-5">
        {filteredFeed.map(activity => {
          const item = activity.mediaItem;
          const config = MEDIA_TYPE_CONFIG[item.type];
          const hasQueued = addedItemNotices[activity.id];

          return (
            <article
              key={activity.id}
              className="bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl p-4 sm:p-5 transition-all shadow-sm space-y-4"
            >
              {/* Activity User Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => openFriend(activity.userId)}
                    className="w-10 h-10 rounded-full overflow-hidden bg-neutral-800 shrink-0 cursor-pointer hover:ring-2 hover:ring-amber-400 transition-all"
                  >
                    <img
                      src={activity.userAvatar}
                      alt={activity.userName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        onClick={() => openFriend(activity.userId)}
                        className="font-display font-semibold text-sm text-neutral-100 hover:text-amber-300 cursor-pointer"
                      >
                        {activity.userName}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {activity.userHandle}
                      </span>
                    </div>

                    <div className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span>
                        {activity.activityType === 'completed_review'
                          ? `rated & reviewed`
                          : activity.activityType === 'progress_update'
                          ? `updated progress on`
                          : `started`}
                      </span>
                      <span className="font-medium text-neutral-200">
                        {item.title}
                      </span>
                      <span aria-hidden="true" className="text-neutral-600">·</span>
                      <span className="text-neutral-500 text-[11px]">{activity.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Badge if reviewed */}
                {activity.rating && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono font-semibold text-amber-400 tabular-nums shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{activity.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Progress Note / Thought */}
              {activity.progressNote && (
                <p className="text-xs sm:text-sm text-neutral-300 pl-3 border-l-2 border-neutral-700 italic">
                  "{activity.progressNote}"
                </p>
              )}

              {/* Review Snippet if available */}
              {activity.reviewSnippet && (
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/80">
                  {activity.reviewSnippet}
                </p>
              )}

              {/* Embedded Media Mini-Card */}
              <div className="p-3 bg-neutral-950/80 border border-neutral-800/80 rounded-xl flex items-center justify-between gap-3 group">
                <div
                  onClick={() => setSelectedMediaModal(item)}
                  className="flex items-center gap-3 cursor-pointer min-w-0"
                >
                  <div className="w-12 h-16 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-neutral-800">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
                      <MediaIcon type={item.type} className="w-3 h-3 text-amber-400" />
                      <span>{config.singular}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.genres[0]}</span>
                    </div>
                    <h4 className="font-display font-semibold text-sm text-neutral-100 group-hover:text-amber-300 transition-colors truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-neutral-400 truncate">
                      {item.creator}
                    </p>
                  </div>
                </div>

                {/* Direct Action: Add to my rotation / queue */}
                <button
                  onClick={() => handleQueueFromFeed(activity)}
                  disabled={hasQueued}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 ${
                    hasQueued
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                  }`}
                >
                  {hasQueued ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Add to Up Next</span>
                    </>
                  )}
                </button>
              </div>

              {/* Feed Post Footer: Likes, Comments Count, Share */}
              <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleLikeActivity(activity.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      activity.likedByCurrentUser
                        ? 'text-rose-500 font-semibold'
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        activity.likedByCurrentUser ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                    <span className="font-mono tabular-nums">{activity.likesCount}</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-neutral-400">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-mono tabular-nums">{activity.comments.length}</span>
                  </div>
                </div>

                <span className="text-[11px] text-neutral-500">
                  {config.verbs.consuming} in 2026
                </span>
              </div>

              {/* Comments Section */}
              {activity.comments.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-neutral-800/50">
                  {activity.comments.map(c => (
                    <div key={c.id} className="flex items-start gap-2.5 text-xs">
                      <img
                        src={c.userAvatar}
                        alt={c.userName}
                        className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                        referrerPolicy="no-referrer"
                      />
                      <div className="bg-neutral-950/80 rounded-xl px-3 py-2 border border-neutral-800 flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-semibold text-neutral-200">{c.userName}</span>
                          <span className="text-[10px] text-neutral-500">{c.timestamp}</span>
                        </div>
                        <p className="text-neutral-300 text-xs">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Input */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Leave a comment or reaction..."
                  value={commentInputs[activity.id] || ''}
                  onChange={(e) =>
                    setCommentInputs(prev => ({ ...prev, [activity.id]: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment(activity.id)}
                  className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/80 transition-colors"
                />
                <button
                  onClick={() => handleAddComment(activity.id)}
                  disabled={!commentInputs[activity.id]?.trim()}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-200 text-xs font-medium rounded-xl transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
