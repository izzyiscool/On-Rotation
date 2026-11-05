import { MediaType, MediaStatus } from '../types/media';

export interface MediaTypeConfig {
  label: string;
  singular: string;
  iconName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  unit: string;
  verbs: {
    consuming: string; // e.g. "Reading", "Watching", "Playing", "Listening to"
    consumed: string; // "Read", "Watched", "Played", "Listened to"
    queued: string; // "Want to read", "Want to watch"
  };
}

export const MEDIA_TYPE_CONFIG: Record<MediaType, MediaTypeConfig> = {
  book: {
    label: 'Books',
    singular: 'Book',
    iconName: 'BookOpen',
    color: 'emerald',
    badgeBg: 'bg-emerald-950/60 dark:bg-emerald-950/80',
    badgeText: 'text-emerald-400',
    unit: 'pages',
    verbs: {
      consuming: 'Reading',
      consumed: 'Read',
      queued: 'Want to Read',
    },
  },
  tv: {
    label: 'TV Shows',
    singular: 'TV Series',
    iconName: 'Tv',
    color: 'sky',
    badgeBg: 'bg-sky-950/60 dark:bg-sky-950/80',
    badgeText: 'text-sky-400',
    unit: 'episodes',
    verbs: {
      consuming: 'Watching',
      consumed: 'Watched',
      queued: 'Want to Watch',
    },
  },
  movie: {
    label: 'Movies',
    singular: 'Movie',
    iconName: 'Film',
    color: 'amber',
    badgeBg: 'bg-amber-950/60 dark:bg-amber-950/80',
    badgeText: 'text-amber-400',
    unit: 'minutes',
    verbs: {
      consuming: 'Watching',
      consumed: 'Watched',
      queued: 'Plan to Watch',
    },
  },
  music: {
    label: 'Music',
    singular: 'Album',
    iconName: 'Disc',
    color: 'violet',
    badgeBg: 'bg-violet-950/60 dark:bg-violet-950/80',
    badgeText: 'text-violet-400',
    unit: 'tracks',
    verbs: {
      consuming: 'Spinning',
      consumed: 'Experienced',
      queued: 'Want to Spin',
    },
  },
  podcast: {
    label: 'Podcasts',
    singular: 'Podcast',
    iconName: 'Radio',
    color: 'rose',
    badgeBg: 'bg-rose-950/60 dark:bg-rose-950/80',
    badgeText: 'text-rose-400',
    unit: 'episodes',
    verbs: {
      consuming: 'Listening to',
      consumed: 'Listened',
      queued: 'Saved to Queue',
    },
  },
  game: {
    label: 'Video Games',
    singular: 'Game',
    iconName: 'Gamepad2',
    color: 'indigo',
    badgeBg: 'bg-indigo-950/60 dark:bg-indigo-950/80',
    badgeText: 'text-indigo-400',
    unit: 'hours',
    verbs: {
      consuming: 'Playing',
      consumed: 'Completed',
      queued: 'Backlogged',
    },
  },
};

export const STATUS_CONFIG: Record<MediaStatus, { label: string; dotColor: string; description: string }> = {
  in_progress: {
    label: 'On Rotation',
    dotColor: 'bg-amber-400',
    description: 'Currently consuming',
  },
  up_next: {
    label: 'Up Next',
    dotColor: 'bg-cyan-400',
    description: 'Queued in backlog',
  },
  completed: {
    label: 'Finished',
    dotColor: 'bg-emerald-400',
    description: 'Logged & rated',
  },
  paused: {
    label: 'Paused',
    dotColor: 'bg-neutral-400',
    description: 'Temporarily on hold',
  },
  dropped: {
    label: 'Dropped',
    dotColor: 'bg-rose-400',
    description: 'Did not finish',
  },
};

export function getProgressPercentage(current: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((current / total) * 100));
}

export function formatMediaMetric(type: MediaType, current: number, total: number, extraMeta?: any): string {
  const pct = getProgressPercentage(current, total);
  switch (type) {
    case 'book':
      return `${current} of ${total} pages (${pct}%)`;
    case 'tv':
      return extraMeta?.currentSeason
        ? `S${extraMeta.currentSeason} E${extraMeta.currentEpisode || current} (${pct}%)`
        : `Ep ${current} of ${total} (${pct}%)`;
    case 'game':
      return `${current} hrs played (${pct}%)`;
    case 'music':
      return `${current} of ${total} tracks (${pct}%)`;
    case 'movie':
      return `${current} of ${total} mins (${pct}%)`;
    case 'podcast':
      return `${Math.round(current)} mins in (${pct}%)`;
    default:
      return `${current} / ${total} (${pct}%)`;
  }
}
