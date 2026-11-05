import React, { useState } from 'react';
import { useRotation } from '../context/RotationContext';
import { MediaType, MediaStatus, MediaItem } from '../types/media';
import { MEDIA_TYPE_CONFIG } from '../utils/mediaUtils';
import { LOCAL_IMAGE_MAP } from '../data/initialData';
import { MediaIcon } from './MediaIcon';
import { X, Star, Plus, Check } from 'lucide-react';

export const QuickLogModal: React.FC = () => {
  const { isQuickLogOpen, setIsQuickLogOpen, addMediaItem } = useRotation();

  const [type, setType] = useState<MediaType>('book');
  const [title, setTitle] = useState('');
  const [creator, setCreator] = useState('');
  const [status, setStatus] = useState<MediaStatus>('in_progress');
  const [genres, setGenres] = useState('');
  const [progressTotal, setProgressTotal] = useState<number>(350);
  const [progressCurrent, setProgressCurrent] = useState<number>(0);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState('');
  const [formatOrPlatform, setFormatOrPlatform] = useState('');

  if (!isQuickLogOpen) return null;

  const defaultTotals: Record<MediaType, { total: number; unit: MediaItem['progressUnit']; placeholder: string; creatorLabel: string }> = {
    book: { total: 350, unit: 'pages', placeholder: 'e.g. Tomorrow, and Tomorrow, and Tomorrow', creatorLabel: 'Author' },
    tv: { total: 10, unit: 'episodes', placeholder: 'e.g. Severance, Shōgun, The Bear', creatorLabel: 'Showrunner / Network' },
    movie: { total: 120, unit: 'minutes', placeholder: 'e.g. Dune: Part Two, Past Lives', creatorLabel: 'Director' },
    music: { total: 12, unit: 'tracks', placeholder: 'e.g. In Rainbows, Brat', creatorLabel: 'Artist / Band' },
    podcast: { total: 60, unit: 'minutes', placeholder: 'e.g. Hardcore History, Search Engine', creatorLabel: 'Host / Network' },
    game: { total: 40, unit: 'hours', placeholder: 'e.g. Elden Ring, Metaphor: ReFantazio', creatorLabel: 'Developer / Studio' },
  };

  const handleTypeChange = (newType: MediaType) => {
    setType(newType);
    setProgressTotal(defaultTotals[newType].total);
    setProgressCurrent(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !creator.trim()) return;

    const config = defaultTotals[type];
    const parsedGenres = genres.trim()
      ? genres.split(',').map(g => g.trim()).filter(Boolean)
      : [MEDIA_TYPE_CONFIG[type].label];

    const isDone = status === 'completed';
    const finalCurrent = isDone ? progressTotal : progressCurrent;

    // Pick a clean curated artwork URL based on type
    const fallbackCovers: Record<MediaType, string> = {
      book: LOCAL_IMAGE_MAP['The Waves Between Us'],
      movie: LOCAL_IMAGE_MAP['Eclipse of the Twin Moons'],
      music: LOCAL_IMAGE_MAP['Sonic Fluidity'],
      game: LOCAL_IMAGE_MAP['Neon Edge: Forge Your Destiny'],
      tv: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      podcast: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80',
    };

    addMediaItem({
      title: title.trim(),
      creator: creator.trim(),
      type,
      coverImage: fallbackCovers[type],
      releaseYear: 2026,
      genres: parsedGenres,
      status,
      progressCurrent: finalCurrent,
      progressTotal,
      progressUnit: config.unit,
      userRating: isDone && rating > 0 ? rating : undefined,
      userReview: isDone && review.trim() ? review.trim() : undefined,
      userReviewDate: isDone ? new Date().toISOString().split('T')[0] : undefined,
      startedAt: status === 'in_progress' ? new Date().toISOString().split('T')[0] : undefined,
      finishedAt: isDone ? new Date().toISOString().split('T')[0] : undefined,
      bookMeta: type === 'book' ? { format: (formatOrPlatform as any) || 'Paperback' } : undefined,
      gameMeta: type === 'game' ? { platform: (formatOrPlatform as any) || 'PlayStation 5', completionType: 'Main Story', hoursPlayed: finalCurrent } : undefined,
      tvMeta: type === 'tv' ? { totalSeasons: 1, currentSeason: 1, currentEpisode: finalCurrent } : undefined,
    });

    setIsQuickLogOpen(false);
  };

  const allTypes: MediaType[] = ['book', 'tv', 'movie', 'music', 'podcast', 'game'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-900/90">
          <div>
            <h3 className="font-display font-bold text-lg text-neutral-100">
              Log Media into On Rotation
            </h3>
            <p className="text-xs text-neutral-400">
              Record a book, series, movie, album, podcast, or game
            </p>
          </div>
          <button
            onClick={() => setIsQuickLogOpen(false)}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Format Selector Pills */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2">
              Select Media Category
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {allTypes.map(t => {
                const isSelected = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleTypeChange(t)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-neutral-950 font-bold border-amber-400 shadow-sm'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:border-neutral-700'
                    }`}
                  >
                    <MediaIcon type={t} className="w-4 h-4 mb-1" />
                    <span>{MEDIA_TYPE_CONFIG[t].singular}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title & Creator */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                placeholder={defaultTotals[type].placeholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                {defaultTotals[type].creatorLabel} *
              </label>
              <input
                type="text"
                required
                placeholder="Creator name..."
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
              Initial Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('in_progress')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  status === 'in_progress'
                    ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
              >
                On Rotation (Active)
              </button>
              <button
                type="button"
                onClick={() => setStatus('up_next')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  status === 'up_next'
                    ? 'bg-cyan-500 text-neutral-950 border-cyan-500 shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
              >
                Up Next (Backlog)
              </button>
              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                  status === 'completed'
                    ? 'bg-emerald-400 text-neutral-950 border-emerald-400 shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
              >
                Finished (Rate & Review)
              </button>
            </div>
          </div>

          {/* Progress Bounds */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Total {defaultTotals[type].unit}
              </label>
              <input
                type="number"
                min="1"
                value={progressTotal}
                onChange={(e) => setProgressTotal(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1">
                Current {defaultTotals[type].unit}
              </label>
              <input
                type="number"
                min="0"
                max={progressTotal}
                value={status === 'completed' ? progressTotal : progressCurrent}
                disabled={status === 'completed'}
                onChange={(e) => setProgressCurrent(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 font-mono focus:outline-none focus:border-amber-400 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Genres / Tags */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1">
              Genres / Themes (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Sci-Fi, Cyberpunk, Drama, Art Pop"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* If completed, show rating & review right away */}
          {status === 'completed' && (
            <div className="p-4 bg-neutral-950/80 rounded-2xl border border-neutral-800 space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          rating >= s ? 'text-amber-400 fill-amber-400' : 'text-neutral-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-amber-400 ml-2">
                    {rating > 0 ? `${rating}.0 / 5.0` : 'Tap to rate'}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Quick Review
                </label>
                <textarea
                  rows={2}
                  placeholder="Share a short takeaway with your social circle..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {/* Bottom Submit */}
          <div className="pt-2 border-t border-neutral-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsQuickLogOpen(false)}
              className="px-4 py-2 text-xs text-neutral-400 hover:text-neutral-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs rounded-xl transition-all shadow-sm"
            >
              Log into Rotation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
