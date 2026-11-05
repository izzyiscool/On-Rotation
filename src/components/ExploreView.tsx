import React, { useState } from 'react';
import { useRotation } from '../context/RotationContext';
import { DISCOVER_CATALOG } from '../data/initialData';
import { MediaType } from '../types/media';
import { MEDIA_TYPE_CONFIG } from '../utils/mediaUtils';
import { MediaIcon } from './MediaIcon';
import { Compass, BookmarkPlus, Disc, Check, Plus, Search } from 'lucide-react';

export const ExploreView: React.FC = () => {
  const { addToMyRotation, mediaItems, setIsQuickLogOpen } = useRotation();
  const [selectedType, setSelectedType] = useState<'all' | MediaType>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [addedIds, setAddedIds] = useState<Record<string, 'rotation' | 'up_next'>>({});

  const existingTitles = new Set(mediaItems.map(m => m.title.toLowerCase()));

  const handleAdd = (item: any, mode: 'rotation' | 'up_next') => {
    addToMyRotation(item, mode === 'rotation' ? 'in_progress' : 'up_next');
    setAddedIds(prev => ({ ...prev, [item.id]: mode }));
    setTimeout(() => {
      setAddedIds(prev => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    }, 2500);
  };

  const filteredDiscover = DISCOVER_CATALOG.filter(item => {
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchT = item.title.toLowerCase().includes(q);
      const matchC = item.creator.toLowerCase().includes(q);
      const matchG = item.genres.some(g => g.toLowerCase().includes(q));
      if (!matchT && !matchC && !matchG) return false;
    }
    return true;
  });

  const allTypes: MediaType[] = ['book', 'tv', 'movie', 'music', 'podcast', 'game'];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wide">
            <Compass className="w-3.5 h-3.5" />
            <span>Discover & Recommendations</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400 font-normal lowercase">Trending cultural selections</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 tracking-tight mt-1">
            Discover Media
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Explore curated picks across all 6 formats and seamlessly add them to your queue or active rotation.
          </p>
        </div>

        <button
          onClick={() => setIsQuickLogOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Title</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedType === 'all'
                ? 'bg-neutral-800 text-white font-semibold'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            All Formats
          </button>
          {allTypes.map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedType === t
                  ? 'bg-neutral-800 text-white font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <MediaIcon type={t} className="w-3.5 h-3.5" />
              <span>{MEDIA_TYPE_CONFIG[t].label}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter trending..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Discover Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDiscover.map(item => {
          const config = MEDIA_TYPE_CONFIG[item.type];
          const isAlreadyInLib = existingTitles.has(item.title.toLowerCase());
          const justAdded = addedIds[item.id];

          return (
            <div
              key={item.id}
              className="bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl p-4 flex flex-col justify-between transition-all group shadow-sm"
            >
              <div>
                <div className="flex gap-4 mb-3">
                  <div className="w-20 h-28 rounded-xl overflow-hidden bg-neutral-950 shrink-0 border border-neutral-800 shadow-md">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                      <MediaIcon type={item.type} className="w-3.5 h-3.5 text-amber-400" />
                      <span>{config.singular}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.releaseYear}</span>
                    </div>

                    <h3 className="font-display font-bold text-base text-neutral-100 group-hover:text-amber-300 transition-colors line-clamp-2 mt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      {item.creator}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.genres.slice(0, 2).map(g => (
                        <span key={g} className="text-[10px] text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800/80">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {item.favoriteTags && item.favoriteTags.length > 0 && (
                  <p className="text-xs text-neutral-400 italic mb-3">
                    Highlighted for: {item.favoriteTags.join(' · ')}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-neutral-800/80 flex items-center gap-2">
                {justAdded ? (
                  <div className="w-full py-2 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>Added to {justAdded === 'rotation' ? 'Rotation' : 'Up Next'}!</span>
                  </div>
                ) : isAlreadyInLib ? (
                  <div className="w-full py-2 bg-neutral-950 text-neutral-400 rounded-xl text-xs text-center border border-neutral-800">
                    Already in your library
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleAdd(item, 'rotation')}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl text-xs font-semibold transition-all shadow-sm"
                    >
                      <Disc className="w-3.5 h-3.5" />
                      <span>Put On Rotation</span>
                    </button>
                    <button
                      onClick={() => handleAdd(item, 'up_next')}
                      className="flex items-center gap-1 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-medium transition-colors"
                      title="Queue in Up Next"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Queue</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
