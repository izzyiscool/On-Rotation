import React, { useState } from 'react';
import { useRotation } from '../context/RotationContext';
import { MediaItem, MediaStatus } from '../types/media';
import { MEDIA_TYPE_CONFIG, STATUS_CONFIG, getProgressPercentage } from '../utils/mediaUtils';
import { MediaIcon } from './MediaIcon';
import {
  X,
  Star,
  Calendar,
  CheckCircle2,
  Trash2,
  Share2,
  BookOpen,
  Bookmark,
  RotateCw,
  Tag,
} from 'lucide-react';

export const MediaDetailModal: React.FC = () => {
  const {
    selectedMediaModal,
    setSelectedMediaModal,
    updateProgress,
    changeMediaStatus,
    submitReview,
    deleteMediaItem,
  } = useRotation();

  if (!selectedMediaModal) return null;

  const item = selectedMediaModal;
  const config = MEDIA_TYPE_CONFIG[item.type];
  const pct = getProgressPercentage(item.progressCurrent, item.progressTotal);

  const [ratingInput, setRatingInput] = useState<number>(item.userRating || 0);
  const [reviewInput, setReviewInput] = useState<string>(item.userReview || '');
  const [tempProgress, setTempProgress] = useState<number>(item.progressCurrent);
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>(item.favoriteTags || []);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleRatingClick = (starValue: number) => {
    setRatingInput(starValue);
  };

  const handleSaveReview = () => {
    submitReview(item.id, ratingInput, reviewInput, tags);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2000);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5 font-medium text-neutral-300">
              <MediaIcon type={item.type} className="w-4 h-4 text-amber-400" />
              <span>{config.singular}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{item.genres.join(', ')}</span>
          </div>

          <button
            onClick={() => setSelectedMediaModal(null)}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Media Showcase Header */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-28 sm:w-36 h-40 sm:h-52 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0 shadow-lg relative mx-auto sm:mx-0">
              <img
                src={item.coverImage}
                alt={item.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2 bg-neutral-950/80 backdrop-blur-sm text-[10px] font-mono px-2 py-0.5 rounded text-neutral-200 border border-neutral-800">
                {item.releaseYear || '2024'}
              </div>
            </div>

            <div className="flex-1 space-y-2.5 text-center sm:text-left">
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-neutral-100">
                  {item.title}
                </h2>
                <p className="text-sm sm:text-base text-neutral-400 mt-0.5">
                  by <span className="text-neutral-200 font-medium">{item.creator}</span>
                </p>
              </div>

              {/* Status Selector Dropdown / Segmented control */}
              <div className="pt-1">
                <label className="text-xs text-neutral-400 block mb-1.5 font-medium">
                  Current Status
                </label>
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {(['in_progress', 'up_next', 'completed', 'paused', 'dropped'] as MediaStatus[]).map(statusKey => {
                    const isSelected = item.status === statusKey;
                    const stConfig = STATUS_CONFIG[statusKey];
                    return (
                      <button
                        key={statusKey}
                        onClick={() => changeMediaStatus(item.id, statusKey)}
                        className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                          isSelected
                            ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                            : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/80'
                        }`}
                      >
                        {stConfig.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Metadata tags */}
              <div className="pt-2 flex flex-wrap gap-1.5 justify-center sm:justify-start text-xs text-neutral-400">
                {item.startedAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Started {item.startedAt}</span>
                  </span>
                )}
                {item.finishedAt && (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Finished {item.finishedAt}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Progress Tracker Slider Section */}
          <div className="p-4 sm:p-5 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-display font-semibold text-neutral-200 flex items-center gap-2">
                <span>Progress Tracker</span>
                <span className="text-neutral-500 font-mono text-xs font-normal">({pct}%)</span>
              </span>
              <div className="flex items-center gap-1 font-mono tabular-nums text-amber-400 font-semibold text-xs sm:text-sm">
                <span>{tempProgress}</span>
                <span className="text-neutral-500">/</span>
                <span>{item.progressTotal} {item.progressUnit}</span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max={item.progressTotal || 100}
              value={tempProgress}
              onChange={(e) => setTempProgress(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-2 bg-neutral-800 rounded-lg"
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTempProgress(prev => Math.max(0, prev - 10))}
                  className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-md"
                >
                  -10
                </button>
                <button
                  onClick={() => setTempProgress(prev => Math.min(item.progressTotal, prev + 10))}
                  className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-md"
                >
                  +10
                </button>
                <button
                  onClick={() => setTempProgress(item.progressTotal)}
                  className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 text-xs rounded-md font-medium"
                >
                  Max (Finished)
                </button>
              </div>

              {tempProgress !== item.progressCurrent && (
                <button
                  onClick={() => updateProgress(item.id, tempProgress)}
                  className="px-3.5 py-1 text-xs font-semibold bg-amber-400 text-neutral-950 rounded-lg hover:bg-amber-300 transition-all shadow-sm"
                >
                  Update Log
                </button>
              )}
            </div>
          </div>

          {/* Rating & Review Section (Goodreads / Letterboxd style) */}
          <div className="p-4 sm:p-5 bg-neutral-950/60 border border-neutral-800/80 rounded-2xl space-y-4">
            <div>
              <label className="text-xs font-display font-semibold text-neutral-200 block mb-2">
                Your Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(starNum => {
                  const isFilled = ratingInput >= starNum;
                  const isHalf = ratingInput === starNum - 0.5;
                  return (
                    <button
                      key={starNum}
                      type="button"
                      onClick={() => handleRatingClick(ratingInput === starNum ? starNum - 0.5 : starNum)}
                      className="p-1 hover:scale-110 transition-transform focus:outline-none"
                      title={`${starNum} stars`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400'
                            : isHalf
                            ? 'text-amber-400 fill-amber-400/50'
                            : 'text-neutral-600 hover:text-neutral-400'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="font-mono tabular-nums text-sm font-semibold text-amber-400 ml-2">
                  {ratingInput > 0 ? `${ratingInput.toFixed(1)} / 5.0` : 'Not rated'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-display font-semibold text-neutral-200 block mb-1.5">
                Your Review & Reflections
              </label>
              <textarea
                rows={3}
                placeholder={`What stood out to you about this ${config.singular.toLowerCase()}? Favorite moments, thoughts, themes...`}
                value={reviewInput}
                onChange={(e) => setReviewInput(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs sm:text-sm text-neutral-200 focus:outline-none focus:border-amber-500/80 transition-colors placeholder:text-neutral-600"
              />
            </div>

            {/* Custom tags */}
            <div>
              <label className="text-xs font-display font-semibold text-neutral-200 block mb-1.5">
                Tags & Vibes
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs text-neutral-300 bg-neutral-800/80 border border-neutral-700/60 rounded-md px-2 py-0.5"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-neutral-500 hover:text-neutral-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a vibe tag (e.g. Cozy, Masterpiece, Mind-Bending)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-500/80"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {isSavedNotice && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Review saved and posted to feed!
                </span>
              )}
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={handleSaveReview}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs rounded-xl transition-all shadow-sm"
                >
                  Save Review & Post
                </button>
              </div>
            </div>
          </div>

          {/* Delete Action */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to remove "${item.title}" from your library?`)) {
                  deleteMediaItem(item.id);
                }
              }}
              className="flex items-center gap-1.5 text-xs text-rose-400/80 hover:text-rose-300 transition-colors p-2 rounded-lg hover:bg-rose-950/30"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove from Library</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
