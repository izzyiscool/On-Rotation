export type MediaType = 'book' | 'tv' | 'movie' | 'music' | 'podcast' | 'game';

export type MediaStatus = 'in_progress' | 'up_next' | 'completed' | 'paused' | 'dropped';

export interface MediaItem {
  id: string;
  title: string;
  creator: string; // Author, Director, Artist, Studio/Developer, Host
  type: MediaType;
  coverImage: string;
  releaseYear?: number;
  genres: string[];
  status: MediaStatus;
  userRating?: number; // 0.5 to 5.0
  userReview?: string;
  userReviewDate?: string;
  favoriteTags?: string[];
  
  // Progress tracking metrics tailored to media type
  progressCurrent: number;
  progressTotal: number;
  progressUnit: 'pages' | 'episodes' | 'minutes' | 'hours' | 'tracks' | 'percent';
  
  // Specific metadata
  bookMeta?: {
    format: 'Paperback' | 'Hardcover' | 'E-book' | 'Audiobook';
    chaptersTotal?: number;
    currentChapter?: number;
    quoteFavorite?: string;
  };
  tvMeta?: {
    totalSeasons: number;
    currentSeason: number;
    currentEpisode: number;
    network?: string;
    episodeTitle?: string;
  };
  movieMeta?: {
    runtimeMinutes: number;
    director: string;
    rewatchCount: number;
    viewingPlatform?: string;
  };
  musicMeta?: {
    format: 'Vinyl' | 'Digital' | 'CD' | 'Cassette';
    favoriteTrack?: string;
    listenCount: number;
    totalTracks: number;
  };
  podcastMeta?: {
    episodeTitle?: string;
    host: string;
    durationMinutes: number;
  };
  gameMeta?: {
    platform: 'PlayStation 5' | 'Nintendo Switch' | 'PC' | 'Xbox Series X' | 'Steam Deck';
    completionType: 'Main Story' | 'Main + Extras' | '100% Completion' | 'Platinum';
    currentArcOrChapter?: string;
    hoursPlayed: number;
  };

  startedAt?: string;
  finishedAt?: string;
  updatedAt: string;
  notes?: string;
}

export interface SocialComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface SocialActivity {
  id: string;
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  activityType: 'started' | 'progress_update' | 'completed_review' | 'added_to_up_next' | 'rewatch';
  mediaItem: MediaItem;
  progressNote?: string;
  reviewSnippet?: string;
  rating?: number;
  timestamp: string;
  likesCount: number;
  likedByCurrentUser: boolean;
  comments: SocialComment[];
}

export interface FriendProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
  currentlyRotating: MediaItem[];
  topFourFavorites: MediaItem[];
  recentReviewsCount: number;
  annualCompletedCount: number;
}

export interface MediaGoal {
  id: string;
  type: MediaType;
  year: number;
  targetCount: number;
  currentCount: number;
  unitLabel: string;
}

export interface CuratedShelf {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  itemIds: string[];
  isPublic: boolean;
  updatedAt: string;
}
