import React, { useState, useMemo } from 'react';
import { useRotation } from '../context/RotationContext';
import { MediaType, MediaStatus } from '../types/media';
import { MEDIA_TYPE_CONFIG, STATUS_CONFIG } from '../utils/mediaUtils';
import { MediaCard } from './MediaCard';
import { MediaIcon } from './MediaIcon';
import { Search, Plus, SlidersHorizontal, ArrowUpDown, Filter, Sparkles } from 'lucide-react';

export const LibraryView: React.FC = () => {
  const {
    mediaItems,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    setSelectedMediaModal,
    setIsQuickLogOpen,
  } = useRotation();

  const [sortBy, setSortBy] = useState<'updated' | 'rating' | 'title' | 'year'>('updated');

  const filteredItems = useMemo(() => {
    return mediaItems
      .filter(item => {
        // Category filter
        if (selectedCategory !== 'all' && item.type !== selectedCategory) return false;
        // Status filter
        if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(query);
          const matchCreator = item.creator.toLowerCase().includes(query);
          const matchGenre = item.genres.some(g => g.toLowerCase().includes(query));
          if (!matchTitle && !matchCreator && !matchGenre) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return (b.userRating || 0) - (a.userRating || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'year') {
          return (b.releaseYear || 0) - (a.releaseYear || 0);
        }
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [mediaItems, selectedCategory, selectedStatus, searchQuery, sortBy]);

  const allCategories: MediaType[] = ['book', 'tv', 'movie', 'music', 'podcast', 'game'];
  const allStatuses: MediaStatus[] = ['in_progress', 'up_next', 'completed', 'paused', 'dropped'];

  return (
    <div className="space-y-6">
      {/* Top Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 tracking-tight">
            My Entertainment Library
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Complete catalogue of everything you’ve read, watched, played, and listened to.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title, author, genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/80 transition-colors"
            />
          </div>

          <button
            onClick={() => setIsQuickLogOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Media</span>
          </button>
        </div>
      </div>

      {/* Filter Bar Controls */}
      <div className="space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
            }`}
          >
            All Categories ({mediaItems.length})
          </button>
          {allCategories.map(cat => {
            const count = mediaItems.filter(m => m.type === cat).length;
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isSel
                    ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <MediaIcon type={cat} className="w-3.5 h-3.5" />
                <span>{MEDIA_TYPE_CONFIG[cat].label}</span>
                <span className="text-[11px] font-mono text-neutral-500">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Status Pills & Sort Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs text-neutral-500 mr-1 hidden sm:inline">Status:</span>
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
                selectedStatus === 'all'
                  ? 'bg-neutral-800 text-neutral-100 font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              All Statuses
            </button>
            {allStatuses.map(statusKey => {
              const count = mediaItems.filter(m => {
                const matchesCat = selectedCategory === 'all' || m.type === selectedCategory;
                return matchesCat && m.status === statusKey;
              }).length;
              const isSel = selectedStatus === statusKey;
              return (
                <button
                  key={statusKey}
                  onClick={() => setSelectedStatus(statusKey)}
                  className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                    isSel
                      ? 'bg-neutral-800 text-neutral-100 font-medium'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {STATUS_CONFIG[statusKey].label} ({count})
                </button>
              );
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 ml-auto text-xs text-neutral-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
            >
              <option value="updated">Recently Updated</option>
              <option value="rating">Highest Rated</option>
              <option value="title">Title (A-Z)</option>
              <option value="year">Release Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Library Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {filteredItems.map(item => (
            <MediaCard
              key={item.id}
              item={item}
              onClick={() => setSelectedMediaModal(item)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-neutral-900/40 border border-neutral-800/80 rounded-3xl max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-neutral-800/80 flex items-center justify-center mx-auto text-neutral-400 mb-3">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-display font-semibold text-neutral-200">
            No media found
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No matches for "${searchQuery}". Try a different keyword or category.`
              : 'No items match your active filter combination.'}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="px-3.5 py-1.5 text-xs text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsQuickLogOpen(true)}
              className="px-3.5 py-1.5 text-xs text-neutral-950 font-semibold bg-amber-400 hover:bg-amber-300 rounded-lg"
            >
              + Log New Media
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
