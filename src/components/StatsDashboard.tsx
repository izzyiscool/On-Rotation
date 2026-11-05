import React, { useState } from 'react';
import { useRotation } from '../context/RotationContext';
import { MediaType } from '../types/media';
import { MEDIA_TYPE_CONFIG } from '../utils/mediaUtils';
import { MediaIcon } from './MediaIcon';
import {
  Trophy,
  Target,
  BarChart3,
  Sparkles,
  Share2,
  Check,
  TrendingUp,
  Clock,
  BookOpen,
  Film,
  Plus,
  Minus,
} from 'lucide-react';

export const StatsDashboard: React.FC = () => {
  const { mediaItems, goals, updateGoalTarget } = useRotation();
  const [copiedShareCard, setCopiedShareCard] = useState(false);

  const completedItems = mediaItems.filter(m => m.status === 'completed');

  // Breakdown counts by type
  const countsByType = (type: MediaType) => completedItems.filter(m => m.type === type).length;

  const totalPagesRead = completedItems
    .filter(m => m.type === 'book')
    .reduce((sum, item) => sum + item.progressCurrent, 0);

  const totalMovieMinutes = completedItems
    .filter(m => m.type === 'movie')
    .reduce((sum, item) => sum + item.progressCurrent, 0);

  const totalGameHours = completedItems
    .filter(m => m.type === 'game')
    .reduce((sum, item) => sum + item.progressCurrent, 0);

  const totalAlbumTracks = completedItems
    .filter(m => m.type === 'music')
    .reduce((sum, item) => sum + item.progressCurrent, 0);

  // Ratings distribution
  const ratingsCount: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  completedItems.forEach(item => {
    if (item.userRating) {
      const rounded = Math.round(item.userRating);
      if (ratingsCount[rounded] !== undefined) {
        ratingsCount[rounded]++;
      }
    }
  });

  const handleCopyShareSummary = () => {
    const summary = `🌀 My 2026 On Rotation Summary:\n📚 ${totalPagesRead} pages read (${countsByType('book')} books)\n🎬 ${countsByType('movie')} films watched (${Math.round(totalMovieMinutes / 60)} hrs)\n🎮 ${countsByType('game')} games completed (${totalGameHours} hrs)\n🎵 ${countsByType('music')} albums spun\nTracked with On Rotation.`;
    navigator.clipboard?.writeText(summary);
    setCopiedShareCard(true);
    setTimeout(() => setCopiedShareCard(false), 2500);
  };

  const allTypes: MediaType[] = ['book', 'movie', 'tv', 'game', 'music', 'podcast'];

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wide">
            <Trophy className="w-3.5 h-3.5" />
            <span>2026 Entertainment Intelligence</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400 font-normal lowercase">{completedItems.length} media finished</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 tracking-tight mt-1">
            Entertainment History & Stats
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Quantitative milestones, media distributions, and annual goal tracking across every cultural format.
          </p>
        </div>

        <button
          onClick={handleCopyShareSummary}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-200 rounded-xl transition-all shadow-sm"
        >
          {copiedShareCard ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Share Year Summary</span>
            </>
          )}
        </button>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900/80 border border-neutral-800 p-4 sm:p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Literature Turned</span>
            <BookOpen className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 font-mono tabular-nums">
            {totalPagesRead.toLocaleString()}
          </p>
          <p className="text-[11px] text-neutral-500">
            {countsByType('book')} books completed
          </p>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 p-4 sm:p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Cinema Screened</span>
            <Film className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 font-mono tabular-nums">
            {Math.round(totalMovieMinutes / 60)}{' '}
            <span className="text-base font-normal text-neutral-400">hrs</span>
          </p>
          <p className="text-[11px] text-neutral-500">
            {countsByType('movie')} feature films
          </p>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 p-4 sm:p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Game Worlds Explored</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 font-mono tabular-nums">
            {totalGameHours}{' '}
            <span className="text-base font-normal text-neutral-400">hrs</span>
          </p>
          <p className="text-[11px] text-neutral-500">
            {countsByType('game')} games completed
          </p>
        </div>

        <div className="bg-neutral-900/80 border border-neutral-800 p-4 sm:p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Music In Rotation</span>
            <TrendingUp className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 font-mono tabular-nums">
            {countsByType('music')}{' '}
            <span className="text-base font-normal text-neutral-400">LPs</span>
          </p>
          <p className="text-[11px] text-neutral-500">
            {totalAlbumTracks} tracks experienced
          </p>
        </div>
      </div>

      {/* 2026 Entertainment Goals Section */}
      <div className="p-5 sm:p-6 bg-neutral-900/80 border border-neutral-800 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-display font-bold text-neutral-100 flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              <span>2026 Cultural Goals</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Set and track your yearly milestones across your favorite media formats.
            </p>
          </div>
          <span className="text-xs text-neutral-500 font-mono">
            Pacing on track for 4/4 goals
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {goals.map(goal => {
            const config = MEDIA_TYPE_CONFIG[goal.type];
            const pct = Math.min(100, Math.round((goal.currentCount / goal.targetCount) * 100));

            return (
              <div
                key={goal.id}
                className="p-4 bg-neutral-950/80 border border-neutral-800/80 rounded-2xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MediaIcon type={goal.type} className="w-4 h-4 text-amber-400" />
                    <span className="font-display font-semibold text-sm text-neutral-200">
                      {config.label} Goal
                    </span>
                  </div>

                  {/* Target Adjuster Buttons */}
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <button
                      onClick={() => updateGoalTarget(goal.id, -1)}
                      className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300"
                      title="Decrease target"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono tabular-nums text-neutral-200 font-semibold px-1">
                      {goal.targetCount}
                    </span>
                    <button
                      onClick={() => updateGoalTarget(goal.id, 1)}
                      className="w-6 h-6 rounded bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300"
                      title="Increase target"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-neutral-400 font-mono tabular-nums">
                    <span>
                      {goal.currentCount} {goal.unitLabel}
                    </span>
                    <span className="text-amber-400 font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Media Distribution & Rating Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Media Distribution Breakdown */}
        <div className="p-5 sm:p-6 bg-neutral-900/80 border border-neutral-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-display font-bold text-neutral-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Media Balance Breakdown</span>
            </h4>
            <span className="text-xs text-neutral-500 font-mono tabular-nums">
              {completedItems.length} total completed
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {allTypes.map(type => {
              const count = countsByType(type);
              const pct = completedItems.length > 0 ? Math.round((count / completedItems.length) * 100) : 0;
              const config = MEDIA_TYPE_CONFIG[type];

              return (
                <div key={type} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-neutral-300">
                    <span className="flex items-center gap-2">
                      <MediaIcon type={type} className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{config.label}</span>
                    </span>
                    <span className="font-mono tabular-nums text-neutral-400">
                      {count} items ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rating Spread Breakdown */}
        <div className="p-5 sm:p-6 bg-neutral-900/80 border border-neutral-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-display font-bold text-neutral-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Star Rating Distribution</span>
            </h4>
            <span className="text-xs text-neutral-500 font-mono">
              Avg: 4.8 / 5.0
            </span>
          </div>

          <div className="space-y-2.5 pt-2">
            {[5, 4, 3, 2, 1].map(stars => {
              const count = ratingsCount[stars] || 0;
              const totalRated = Object.values(ratingsCount).reduce((a, b) => a + b, 0);
              const pct = totalRated > 0 ? Math.round((count / totalRated) * 100) : 0;

              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-mono text-neutral-400 tabular-nums font-semibold flex items-center gap-1">
                    <span>{stars}</span>
                    <span>★</span>
                  </span>
                  <div className="flex-1 h-3 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-amber-400/90 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono tabular-nums text-neutral-500 text-[11px]">
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Shareable "Rotation Wrapped" Card Generator Preview */}
      <div className="p-6 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 border border-amber-500/20 rounded-3xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold">
              Shareable Snapshot
            </span>
            <h4 className="text-xl font-display font-bold text-neutral-100 mt-1">
              Your 2026 On Rotation Card
            </h4>
          </div>

          <button
            onClick={handleCopyShareSummary}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold rounded-xl transition-all shadow-md self-start sm:self-auto"
          >
            {copiedShareCard ? 'Copied to Clipboard!' : 'Copy Summary Card'}
          </button>
        </div>

        {/* The Card Render */}
        <div className="p-5 rounded-2xl bg-neutral-950/90 border border-neutral-800 max-w-lg space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <span className="font-display font-bold text-base text-neutral-100">
              🌀 On Rotation · Isabelle W.
            </span>
            <span className="text-xs font-mono text-neutral-500">2026 Wrapped</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-neutral-500 block">Top Finished Book</span>
              <span className="font-medium text-neutral-200">The Waves Between Us</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Top Cinema Experience</span>
              <span className="font-medium text-neutral-200">Past Lives</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Top Game Adventure</span>
              <span className="font-medium text-neutral-200">Elden Ring: Erdtree</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Most Spun Vinyl</span>
              <span className="font-medium text-neutral-200">In Rainbows (Radiohead)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
