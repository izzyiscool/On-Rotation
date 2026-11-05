import React, { useState } from 'react';
import { useRotation } from '../context/RotationContext';
import { MediaItem, MediaType } from '../types/media';
import { MEDIA_TYPE_CONFIG, getProgressPercentage, formatMediaMetric } from '../utils/mediaUtils';
import { MediaIcon } from './MediaIcon';
import { Plus, Check, MoreVertical, Flame, Sparkles, BookOpen, Clock, ChevronRight } from 'lucide-react';

export const CurrentlyRotatingTray: React.FC = () => {
  const {
    mediaItems,
    updateProgress,
    setSelectedMediaModal,
    setIsQuickLogOpen,
    setActiveTab,
    setSelectedCategory,
    setSelectedStatus,
  } = useRotation();

  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | MediaType>('all');
  const [quickNoteInputs, setQuickNoteInputs] = useState<Record<string, string>>({});

  const rotatingItems = mediaItems.filter(item => {
    if (item.status !== 'in_progress') return false;
    if (activeTypeFilter !== 'all' && item.type !== activeTypeFilter) return false;
    return true;
  });

  const allTypes: MediaType[] = ['book', 'tv', 'movie', 'music', 'podcast', 'game'];

  const handleBumpProgress = (item: MediaItem, amount: number) => {
    const note = quickNoteInputs[item.id];
    updateProgress(item.id, item.progressCurrent + amount, note);
    if (note) {
      setQuickNoteInputs(prev => ({ ...prev, [item.id]: '' }));
    }
  };

  const getStepButtonLabel = (item: MediaItem) => {
    switch (item.type) {
      case 'book':
        return '+25 pages';
      case 'tv':
        return 'Watched Next Ep';
      case 'game':
        return '+2 hours';
      case 'music':
        return '+1 Album Spin';
      case 'podcast':
        return '+30 mins';
      case 'movie':
        return '+30 mins';
      default:
        return '+1 unit';
    }
  };

  const getStepAmount = (item: MediaItem) => {
    switch (item.type) {
      case 'book':
        return 25;
      case 'tv':
        return 1;
      case 'game':
        return 2;
      case 'music':
        return 1;
      case 'podcast':
        return 30;
      case 'movie':
        return 30;
      default:
        return 1;
    }
  };

  return (
    <section className="space-y-6">
      {/* Editorial Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-amber-400 uppercase">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Active Tray</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400 font-normal lowercase">{rotatingItems.length} active in rotation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 tracking-tight mt-1">
            Currently On Rotation
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-2xl">
            Your live entertainment shelf across literature, streaming, audio, and gaming. Update progress with one tap or log reflections.
          </p>
        </div>

        {/* Media Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTypeFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTypeFilter === 'all'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            All Media
          </button>
          {allTypes.map(type => (
            <button
              key={type}
              onClick={() => setActiveTypeFilter(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTypeFilter === type
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <MediaIcon type={type} className="w-3.5 h-3.5" />
              <span>{MEDIA_TYPE_CONFIG[type].label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tray Grid */}
      {rotatingItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {rotatingItems.map(item => {
            const config = MEDIA_TYPE_CONFIG[item.type];
            const pct = getProgressPercentage(item.progressCurrent, item.progressTotal);
            const remaining = Math.max(0, item.progressTotal - item.progressCurrent);

            return (
              <div
                key={item.id}
                className="group relative bg-neutral-900/90 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl p-4 sm:p-5 transition-all flex flex-col justify-between shadow-sm"
              >
                <div>
                  {/* Top Category Kicker & Quick Action */}
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-neutral-300 font-medium">
                        <MediaIcon type={item.type} className="w-3.5 h-3.5 text-amber-400" />
                        <span>{config.singular}</span>
                      </span>
                      <span aria-hidden="true" className="text-neutral-600">·</span>
                      <span className="text-neutral-400 truncate max-w-[120px]">
                        {item.bookMeta?.format || item.gameMeta?.platform || item.tvMeta?.network || item.musicMeta?.format || item.genres[0]}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedMediaModal(item)}
                      className="text-neutral-400 hover:text-neutral-200 p-1 rounded-md hover:bg-neutral-800 transition-colors"
                      title="View details & review"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Main Card Media Anatomy */}
                  <div className="flex gap-4 mb-4">
                    {/* Media Artwork Cover with fallback */}
                    <div
                      onClick={() => setSelectedMediaModal(item)}
                      className="relative w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-950 border border-neutral-800 shrink-0 cursor-pointer shadow-md group-hover:scale-[1.02] transition-transform flex items-center justify-center"
                    >
                      {/* Underlying styled fallback */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center select-none">
                        <MediaIcon type={item.type} className="w-6 h-6 text-amber-400/80 mb-1" />
                        <span className="text-[9px] text-neutral-400 font-medium line-clamp-2 leading-tight">
                          {item.title}
                        </span>
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
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[10px] text-white/90 font-mono tabular-nums z-10">
                        <span>{pct}%</span>
                      </div>
                    </div>

                    {/* Metadata & Creator */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3
                          onClick={() => setSelectedMediaModal(item)}
                          className="font-display font-bold text-base sm:text-lg text-neutral-100 hover:text-amber-300 transition-colors cursor-pointer line-clamp-2 leading-snug"
                        >
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-400 truncate mt-0.5">
                          {item.creator}
                        </p>

                        {/* Domain specific detail indicator */}
                        {item.type === 'book' && item.bookMeta?.currentChapter && (
                          <p className="text-xs text-neutral-500 mt-1">
                            Chapter {item.bookMeta.currentChapter} of {item.bookMeta.chaptersTotal}
                          </p>
                        )}
                        {item.type === 'tv' && item.tvMeta && (
                          <p className="text-xs text-neutral-500 mt-1 truncate">
                            S{item.tvMeta.currentSeason} E{item.tvMeta.currentEpisode}: {item.tvMeta.episodeTitle || 'Episode'}
                          </p>
                        )}
                        {item.type === 'game' && item.gameMeta?.currentArcOrChapter && (
                          <p className="text-xs text-neutral-500 mt-1 truncate">
                            {item.gameMeta.currentArcOrChapter}
                          </p>
                        )}
                        {item.type === 'music' && item.musicMeta?.favoriteTrack && (
                          <p className="text-xs text-neutral-500 mt-1 truncate">
                            Fav: {item.musicMeta.favoriteTrack}
                          </p>
                        )}
                        {item.type === 'podcast' && item.podcastMeta?.episodeTitle && (
                          <p className="text-xs text-neutral-500 mt-1 truncate">
                            {item.podcastMeta.episodeTitle}
                          </p>
                        )}
                      </div>

                      {/* Remaining badge */}
                      <div className="mt-2 text-xs text-neutral-400">
                        <span className="font-mono tabular-nums text-amber-400 font-medium">
                          {remaining} {item.progressUnit}
                        </span>{' '}
                        <span>remaining</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar & Slider */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs text-neutral-400">
                      <span className="font-mono tabular-nums">
                        {formatMediaMetric(item.type, item.progressCurrent, item.progressTotal, item.tvMeta)}
                      </span>
                      <span className="font-mono tabular-nums text-neutral-500">
                        {item.progressTotal} {item.progressUnit}
                      </span>
                    </div>

                    <div className="relative w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Interactive Controls */}
                <div className="pt-3 border-t border-neutral-800/80 flex flex-col gap-2.5">
                  <div className="flex items-center gap-2">
                    {/* Primary Step Button */}
                    <button
                      onClick={() => handleBumpProgress(item, getStepAmount(item))}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-800 hover:bg-neutral-700/80 active:bg-neutral-700 text-white rounded-xl text-xs font-semibold transition-all active:scale-[0.98]"
                    >
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>{getStepButtonLabel(item)}</span>
                    </button>

                    {/* Quick Finish / Review Button */}
                    <button
                      onClick={() => {
                        updateProgress(item.id, item.progressTotal);
                        setSelectedMediaModal(item);
                      }}
                      className="flex items-center gap-1 py-2 px-3 bg-neutral-800/60 hover:bg-emerald-950/40 hover:text-emerald-300 text-neutral-300 border border-neutral-700/60 hover:border-emerald-800/50 rounded-xl text-xs font-medium transition-all"
                      title="Mark as completed & rate"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Finish</span>
                    </button>
                  </div>

                  {/* Optional Quick micro-thought / update field */}
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Add an update note (e.g. 'Mind blown by chapter 15')..."
                      value={quickNoteInputs[item.id] || ''}
                      onChange={(e) =>
                        setQuickNoteInputs(prev => ({ ...prev, [item.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && quickNoteInputs[item.id]?.trim()) {
                          handleBumpProgress(item, 0);
                        }
                      }}
                      className="w-full bg-neutral-950/70 border border-neutral-800 focus:border-amber-500/70 text-neutral-200 text-[11px] rounded-lg px-2.5 py-1.5 focus:outline-none transition-colors placeholder:text-neutral-600"
                    />
                    {quickNoteInputs[item.id]?.trim() && (
                      <button
                        onClick={() => handleBumpProgress(item, 0)}
                        className="absolute right-1 text-[10px] font-semibold text-amber-400 hover:text-amber-300 px-2 py-0.5 bg-neutral-900 rounded"
                      >
                        Share
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-neutral-900/40 border border-neutral-800/80 rounded-3xl max-w-2xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 flex items-center justify-center mx-auto text-amber-400 mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-display font-bold text-neutral-200">
            No active media currently on rotation
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1.5 max-w-md mx-auto">
            Bring a novel, show, movie, vinyl record, or game into your active rotation to start tracking progress.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setIsQuickLogOpen(true)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              + Log New Media
            </button>
            <button
              onClick={() => {
                setActiveTab('library');
                setSelectedStatus('up_next');
              }}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium rounded-xl transition-colors"
            >
              Browse Up Next
            </button>
          </div>
        </div>
      )}

      {/* Up Next Quick Peek Bar */}
      <div className="p-4 sm:p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/50 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-display font-semibold text-neutral-200">
              Queued In Up Next
            </h4>
            <p className="text-xs text-neutral-400">
              {mediaItems.filter(m => m.status === 'up_next').length} items waiting in your backlog
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveTab('library');
            setSelectedStatus('up_next');
          }}
          className="flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 py-1.5 px-3 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          <span>View full backlog</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
