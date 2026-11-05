import React from 'react';
import { MediaItem } from '../types/media';
import { MEDIA_TYPE_CONFIG, STATUS_CONFIG, getProgressPercentage } from '../utils/mediaUtils';
import { MediaIcon } from './MediaIcon';
import { Star } from 'lucide-react';

interface MediaCardProps {
  item: MediaItem;
  onClick: () => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onClick }) => {
  const config = MEDIA_TYPE_CONFIG[item.type];
  const statusCfg = STATUS_CONFIG[item.status];
  const pct = getProgressPercentage(item.progressCurrent, item.progressTotal);

  return (
    <div
      onClick={onClick}
      className="group relative bg-neutral-900/70 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl p-3.5 transition-all cursor-pointer flex flex-col justify-between shadow-sm"
    >
      <div>
        {/* Cover Artwork */}
        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-950 border border-neutral-800/80 mb-3 shadow-md group-hover:scale-[1.01] transition-transform flex items-center justify-center">
          {/* Underlying styled fallback */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center select-none">
            <MediaIcon type={item.type} className="w-8 h-8 text-amber-400/80 mb-1.5" />
            <span className="text-[11px] text-neutral-300 font-semibold line-clamp-2 leading-tight">
              {item.title}
            </span>
            <span className="text-[10px] text-neutral-500 truncate mt-0.5">
              {item.creator}
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

          {/* Type Icon & Year Overlay */}
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 text-[10px] text-neutral-300 font-medium">
            <MediaIcon type={item.type} className="w-3 h-3 text-amber-400" />
            <span>{config.singular}</span>
          </div>

          {item.releaseYear && (
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 text-[10px] font-mono text-neutral-400">
              {item.releaseYear}
            </div>
          )}

          {/* Rating or Progress Bottom Overlay */}
          {item.status === 'completed' && item.userRating ? (
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2 py-1 rounded-lg bg-neutral-950/90 backdrop-blur-sm border border-neutral-800 text-xs">
              <span className="flex items-center gap-1 text-amber-400 font-semibold font-mono tabular-nums">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{item.userRating.toFixed(1)}</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Finished</span>
            </div>
          ) : item.status === 'in_progress' ? (
            <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-neutral-950/90 backdrop-blur-sm border border-neutral-800">
              <div className="flex justify-between text-[10px] text-neutral-300 font-mono mb-1">
                <span>On Rotation</span>
                <span>{pct}%</span>
              </div>
              <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-neutral-950/80 text-[10px] text-cyan-400 font-medium border border-neutral-800">
              {statusCfg.label}
            </div>
          )}
        </div>

        {/* Title & Creator */}
        <h4 className="font-display font-bold text-sm sm:text-base text-neutral-100 group-hover:text-amber-300 transition-colors line-clamp-1">
          {item.title}
        </h4>
        <p className="text-xs text-neutral-400 truncate mt-0.5">
          {item.creator}
        </p>
      </div>

      {/* Unboxed Metadata Footer */}
      <div className="mt-3 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500">
        <span className="truncate max-w-[130px]">
          {item.genres[0] || config.label}
        </span>
        <span className="font-mono tabular-nums text-neutral-400">
          {item.progressTotal} {item.progressUnit}
        </span>
      </div>
    </div>
  );
};
