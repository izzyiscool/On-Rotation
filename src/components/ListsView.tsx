import React, { useState } from 'react';
import { useRotation } from '../context/RotationContext';
import { CuratedShelf } from '../types/media';
import { MediaCard } from './MediaCard';
import { Plus, FolderHeart, Sparkles, X, Check } from 'lucide-react';

export const ListsView: React.FC = () => {
  const { shelves, mediaItems, createShelf, setSelectedMediaModal } = useRotation();
  const [selectedShelfId, setSelectedShelfId] = useState<string>(shelves[0]?.id || '');
  const [isCreatingShelf, setIsCreatingShelf] = useState(false);

  // New shelf form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedMediaIds, setSelectedMediaIds] = useState<string[]>([]);

  const activeShelf = shelves.find(s => s.id === selectedShelfId) || shelves[0];

  const shelfItems = activeShelf
    ? mediaItems.filter(m => activeShelf.itemIds.includes(m.id))
    : [];

  const handleCreateNewShelf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createShelf(newTitle.trim(), newDesc.trim(), selectedMediaIds);
    setNewTitle('');
    setNewDesc('');
    setSelectedMediaIds([]);
    setIsCreatingShelf(false);
  };

  const toggleSelectMedia = (id: string) => {
    setSelectedMediaIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wide">
            <FolderHeart className="w-3.5 h-3.5" />
            <span>Curated Collections</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400 font-normal lowercase">{shelves.length} custom shelves</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-100 tracking-tight mt-1">
            Lists & Shelves
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Group your cross-media favorites into thematic shelves, vibes, or ranking lists.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingShelf(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl shadow-sm transition-all whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Custom Shelf</span>
        </button>
      </div>

      {/* Shelf Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
        {shelves.map(shelf => {
          const isSelected = shelf.id === (activeShelf?.id || '');
          return (
            <button
              key={shelf.id}
              onClick={() => setSelectedShelfId(shelf.id)}
              className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors flex items-center gap-2 ${
                isSelected
                  ? 'bg-neutral-800 text-white font-semibold shadow-sm border border-neutral-700'
                  : 'bg-neutral-900 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
              }`}
            >
              <span>{shelf.title}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-400">
                {shelf.itemIds.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Shelf Details Header */}
      {activeShelf && (
        <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-2">
          <h2 className="text-lg font-display font-bold text-neutral-100">
            {activeShelf.title}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
            {activeShelf.description}
          </p>
          <div className="text-[11px] text-neutral-500 pt-1">
            <span>Last updated {activeShelf.updatedAt}</span>
            <span aria-hidden="true"> · </span>
            <span>{shelfItems.length} media items</span>
          </div>
        </div>
      )}

      {/* Grid of Items in Active Shelf */}
      {shelfItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
          {shelfItems.map(item => (
            <MediaCard
              key={item.id}
              item={item}
              onClick={() => setSelectedMediaModal(item)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-neutral-900/40 border border-neutral-800/80 rounded-3xl max-w-md mx-auto">
          <p className="text-sm text-neutral-300 font-medium">This shelf is currently empty.</p>
          <p className="text-xs text-neutral-500 mt-1">Add items from your library or explore to populate it.</p>
        </div>
      )}

      {/* Modal: Create New Shelf */}
      {isCreatingShelf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-display font-bold text-base text-neutral-100">
                Create Custom Shelf
              </h3>
              <button
                onClick={() => setIsCreatingShelf(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewShelf} className="space-y-4">
              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">
                  Shelf Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Autumn Mystery & Noir, Cozy Switch Games..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1 font-medium">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="What binds this collection together?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1.5 font-medium">
                  Select Media to Include ({selectedMediaIds.length} selected)
                </label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-neutral-950 rounded-xl border border-neutral-800">
                  {mediaItems.map(item => {
                    const isSelected = selectedMediaIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleSelectMedia(item.id)}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                          isSelected ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-900 text-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="font-medium truncate">{item.title}</span>
                          <span className="text-neutral-500 text-[11px]">({item.type})</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingShelf(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl shadow-sm"
                >
                  Create Shelf
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
