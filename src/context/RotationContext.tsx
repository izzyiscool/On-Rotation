import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  MediaItem,
  MediaType,
  MediaStatus,
  SocialActivity,
  FriendProfile,
  MediaGoal,
  CuratedShelf,
} from '../types/media';
import {
  INITIAL_MEDIA_ITEMS,
  INITIAL_FRIENDS,
  INITIAL_SOCIAL_FEED,
  INITIAL_GOALS,
  INITIAL_SHELVES,
  LOCAL_IMAGE_MAP,
} from '../data/initialData';

export const resolveCoverImage = (item: { title?: string; coverImage?: string }): string => {
  if (!item || !item.coverImage) return '';
  if (item.title && LOCAL_IMAGE_MAP[item.title]) {
    return LOCAL_IMAGE_MAP[item.title];
  }
  if (LOCAL_IMAGE_MAP[item.coverImage]) {
    return LOCAL_IMAGE_MAP[item.coverImage];
  }
  if (item.coverImage.startsWith('/src/assets/images/')) {
    return item.coverImage.replace('/src/', '/');
  }
  return item.coverImage;
};

export type MainTab = 'rotation' | 'library' | 'feed' | 'stats' | 'shelves' | 'discover';

interface RotationContextType {
  mediaItems: MediaItem[];
  socialFeed: SocialActivity[];
  friends: FriendProfile[];
  goals: MediaGoal[];
  shelves: CuratedShelf[];
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  selectedCategory: 'all' | MediaType;
  setSelectedCategory: (cat: 'all' | MediaType) => void;
  selectedStatus: 'all' | MediaStatus;
  setSelectedStatus: (status: 'all' | MediaStatus) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Modals & Drawers
  selectedMediaModal: MediaItem | null;
  setSelectedMediaModal: (item: MediaItem | null) => void;
  selectedFriendModal: FriendProfile | null;
  setSelectedFriendModal: (friend: FriendProfile | null) => void;
  isQuickLogOpen: boolean;
  setIsQuickLogOpen: (open: boolean) => void;
  isAddCustomOpen: boolean;
  setIsAddCustomOpen: (open: boolean) => void;

  // Actions
  updateProgress: (mediaId: string, newProgress: number, note?: string) => void;
  addMediaItem: (item: Omit<MediaItem, 'id' | 'updatedAt'>) => void;
  updateMediaItem: (item: MediaItem) => void;
  deleteMediaItem: (id: string) => void;
  changeMediaStatus: (id: string, status: MediaStatus) => void;
  submitReview: (id: string, rating: number, review: string, tags?: string[]) => void;
  toggleLikeActivity: (activityId: string) => void;
  addCommentToActivity: (activityId: string, text: string) => void;
  addToMyRotation: (item: Partial<MediaItem> & { title: string; creator: string; type: MediaType }, targetStatus?: MediaStatus) => void;
  toggleFollowFriend: (friendId: string) => void;
  updateGoalTarget: (goalId: string, delta: number) => void;
  createShelf: (title: string, description: string, itemIds: string[]) => void;
}

const RotationContext = createContext<RotationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  MEDIA: 'on_rotation_media_items',
  FEED: 'on_rotation_social_feed',
  FRIENDS: 'on_rotation_friends',
  GOALS: 'on_rotation_goals',
  SHELVES: 'on_rotation_shelves',
  THEME: 'on_rotation_theme',
};

export const RotationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.MEDIA);
      if (!saved) return INITIAL_MEDIA_ITEMS;
      const parsed: MediaItem[] = JSON.parse(saved);
      return parsed.map(item => ({
        ...item,
        coverImage: resolveCoverImage(item),
      }));
    } catch {
      return INITIAL_MEDIA_ITEMS;
    }
  });

  const [socialFeed, setSocialFeed] = useState<SocialActivity[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.FEED);
      if (!saved) return INITIAL_SOCIAL_FEED;
      const parsed: SocialActivity[] = JSON.parse(saved);
      return parsed.map(act => ({
        ...act,
        mediaItem: {
          ...act.mediaItem,
          coverImage: resolveCoverImage(act.mediaItem),
        },
      }));
    } catch {
      return INITIAL_SOCIAL_FEED;
    }
  });

  const [friends, setFriends] = useState<FriendProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.FRIENDS);
      if (!saved) return INITIAL_FRIENDS;
      const parsed: FriendProfile[] = JSON.parse(saved);
      return parsed.map(f => ({
        ...f,
        currentlyRotating: f.currentlyRotating.map(item => ({
          ...item,
          coverImage: resolveCoverImage(item),
        })),
        topFourFavorites: f.topFourFavorites.map(item => ({
          ...item,
          coverImage: resolveCoverImage(item),
        })),
      }));
    } catch {
      return INITIAL_FRIENDS;
    }
  });

  const [goals, setGoals] = useState<MediaGoal[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  const [shelves, setShelves] = useState<CuratedShelf[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SHELVES);
      return saved ? JSON.parse(saved) : INITIAL_SHELVES;
    } catch {
      return INITIAL_SHELVES;
    }
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME);
      return (saved as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [activeTab, setActiveTab] = useState<MainTab>('rotation');
  const [selectedCategory, setSelectedCategory] = useState<'all' | MediaType>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | MediaStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedMediaModal, setSelectedMediaModal] = useState<MediaItem | null>(null);
  const [selectedFriendModal, setSelectedFriendModal] = useState<FriendProfile | null>(null);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);

  // Apply dark mode class to root html element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.MEDIA, JSON.stringify(mediaItems));
  }, [mediaItems]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FEED, JSON.stringify(socialFeed));
  }, [socialFeed]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FRIENDS, JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SHELVES, JSON.stringify(shelves));
  }, [shelves]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateProgress = (mediaId: string, newProgress: number, note?: string) => {
    setMediaItems(prev => {
      return prev.map(item => {
        if (item.id !== mediaId) return item;
        const clampedProgress = Math.max(0, Math.min(newProgress, item.progressTotal));
        const isNowFinished = clampedProgress >= item.progressTotal && item.progressTotal > 0;
        
        const updatedItem: MediaItem = {
          ...item,
          progressCurrent: clampedProgress,
          status: isNowFinished ? 'completed' : item.status === 'up_next' ? 'in_progress' : item.status,
          finishedAt: isNowFinished ? (item.finishedAt || new Date().toISOString().split('T')[0]) : item.finishedAt,
          updatedAt: new Date().toISOString(),
        };

        // Post progress update to social feed
        const newActivity: SocialActivity = {
          id: `act-${Date.now()}`,
          userId: 'current-user',
          userName: 'Isabelle W.',
          userHandle: '@isabelle',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
          activityType: isNowFinished ? 'completed_review' : 'progress_update',
          mediaItem: updatedItem,
          progressNote: note || (isNowFinished 
            ? `Finished ${item.title}!` 
            : `Updated progress to ${clampedProgress} ${item.progressUnit} of ${item.progressTotal}`),
          timestamp: 'Just now',
          likesCount: 0,
          likedByCurrentUser: false,
          comments: [],
        };
        setSocialFeed(feed => [newActivity, ...feed]);

        // If completed, update goals counter
        if (isNowFinished && item.status !== 'completed') {
          setGoals(currentGoals =>
            currentGoals.map(g => (g.type === item.type ? { ...g, currentCount: g.currentCount + 1 } : g))
          );
        }

        return updatedItem;
      });
    });

    // Update modal if currently opened
    setSelectedMediaModal(prev => {
      if (!prev || prev.id !== mediaId) return prev;
      const clamped = Math.max(0, Math.min(newProgress, prev.progressTotal));
      return {
        ...prev,
        progressCurrent: clamped,
        status: clamped >= prev.progressTotal ? 'completed' : prev.status,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const addMediaItem = (item: Omit<MediaItem, 'id' | 'updatedAt'>) => {
    const newItem: MediaItem = {
      ...item,
      id: `media-${Date.now()}`,
      updatedAt: new Date().toISOString(),
      startedAt: item.status === 'in_progress' ? new Date().toISOString().split('T')[0] : item.startedAt,
    };
    setMediaItems(prev => [newItem, ...prev]);

    // Social notification
    const newActivity: SocialActivity = {
      id: `act-${Date.now()}`,
      userId: 'current-user',
      userName: 'Isabelle W.',
      userHandle: '@isabelle',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      activityType: newItem.status === 'in_progress' ? 'started' : 'added_to_up_next',
      mediaItem: newItem,
      progressNote: newItem.status === 'in_progress' ? `Started ${newItem.title}` : `Added ${newItem.title} to Up Next`,
      timestamp: 'Just now',
      likesCount: 0,
      likedByCurrentUser: false,
      comments: [],
    };
    setSocialFeed(feed => [newActivity, ...feed]);
  };

  const updateMediaItem = (updated: MediaItem) => {
    setMediaItems(prev => prev.map(item => (item.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : item)));
    if (selectedMediaModal?.id === updated.id) {
      setSelectedMediaModal(updated);
    }
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
    if (selectedMediaModal?.id === id) {
      setSelectedMediaModal(null);
    }
  };

  const changeMediaStatus = (id: string, status: MediaStatus) => {
    setMediaItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const nowStr = new Date().toISOString().split('T')[0];
        const isFinishing = status === 'completed';
        const started = status === 'in_progress' && !item.startedAt ? nowStr : item.startedAt;
        const finished = isFinishing ? (item.finishedAt || nowStr) : (status === 'in_progress' ? undefined : item.finishedAt);
        const progress = isFinishing && item.progressTotal ? item.progressTotal : item.progressCurrent;

        const updated: MediaItem = {
          ...item,
          status,
          startedAt: started,
          finishedAt: finished,
          progressCurrent: progress,
          updatedAt: new Date().toISOString(),
        };

        if (isFinishing && item.status !== 'completed') {
          setGoals(curr => curr.map(g => (g.type === item.type ? { ...g, currentCount: g.currentCount + 1 } : g)));
        }

        return updated;
      })
    );
  };

  const submitReview = (id: string, rating: number, review: string, tags?: string[]) => {
    const today = new Date().toISOString().split('T')[0];
    let updatedItemRef: MediaItem | null = null;

    setMediaItems(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const updated: MediaItem = {
          ...item,
          userRating: rating,
          userReview: review,
          userReviewDate: today,
          status: 'completed',
          finishedAt: item.finishedAt || today,
          favoriteTags: tags || item.favoriteTags,
          updatedAt: new Date().toISOString(),
        };
        updatedItemRef = updated;
        return updated;
      })
    );

    if (updatedItemRef) {
      setSelectedMediaModal(updatedItemRef);
      // Post to social feed
      const newActivity: SocialActivity = {
        id: `act-${Date.now()}`,
        userId: 'current-user',
        userName: 'Isabelle W.',
        userHandle: '@isabelle',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        activityType: 'completed_review',
        mediaItem: updatedItemRef,
        rating,
        reviewSnippet: review,
        timestamp: 'Just now',
        likesCount: 0,
        likedByCurrentUser: false,
        comments: [],
      };
      setSocialFeed(feed => [newActivity, ...feed]);
    }
  };

  const toggleLikeActivity = (activityId: string) => {
    setSocialFeed(prev =>
      prev.map(act => {
        if (act.id !== activityId) return act;
        const liked = !act.likedByCurrentUser;
        return {
          ...act,
          likedByCurrentUser: liked,
          likesCount: liked ? act.likesCount + 1 : Math.max(0, act.likesCount - 1),
        };
      })
    );
  };

  const addCommentToActivity = (activityId: string, text: string) => {
    if (!text.trim()) return;
    setSocialFeed(prev =>
      prev.map(act => {
        if (act.id !== activityId) return act;
        return {
          ...act,
          comments: [
            ...act.comments,
            {
              id: `c-${Date.now()}`,
              userId: 'current-user',
              userName: 'Isabelle W.',
              userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
              text: text.trim(),
              timestamp: 'Just now',
            },
          ],
        };
      })
    );
  };

  const addToMyRotation = (
    item: Partial<MediaItem> & { title: string; creator: string; type: MediaType },
    targetStatus: MediaStatus = 'in_progress'
  ) => {
    // Check if already in media
    const existing = mediaItems.find(m => m.title.toLowerCase() === item.title.toLowerCase());
    if (existing) {
      changeMediaStatus(existing.id, targetStatus);
      return;
    }

    const defaultTotals: Record<MediaType, { total: number; unit: MediaItem['progressUnit'] }> = {
      book: { total: 350, unit: 'pages' },
      movie: { total: 120, unit: 'minutes' },
      tv: { total: 10, unit: 'episodes' },
      music: { total: 12, unit: 'tracks' },
      podcast: { total: 60, unit: 'minutes' },
      game: { total: 40, unit: 'hours' },
    };

    const typeConfig = defaultTotals[item.type];
    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      title: item.title,
      creator: item.creator,
      type: item.type,
      coverImage: item.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      genres: item.genres || ['Featured'],
      status: targetStatus,
      progressCurrent: 0,
      progressTotal: item.progressTotal || typeConfig.total,
      progressUnit: item.progressUnit || typeConfig.unit,
      startedAt: targetStatus === 'in_progress' ? new Date().toISOString().split('T')[0] : undefined,
      updatedAt: new Date().toISOString(),
      favoriteTags: item.favoriteTags || [],
    };

    setMediaItems(prev => [newItem, ...prev]);

    // Feed event
    const newActivity: SocialActivity = {
      id: `act-${Date.now()}`,
      userId: 'current-user',
      userName: 'Isabelle W.',
      userHandle: '@isabelle',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      activityType: targetStatus === 'in_progress' ? 'started' : 'added_to_up_next',
      mediaItem: newItem,
      progressNote: targetStatus === 'in_progress' ? `Started ${newItem.title}` : `Queued up ${newItem.title}`,
      timestamp: 'Just now',
      likesCount: 0,
      likedByCurrentUser: false,
      comments: [],
    };
    setSocialFeed(feed => [newActivity, ...feed]);
  };

  const toggleFollowFriend = (friendId: string) => {
    setFriends(prev =>
      prev.map(f => {
        if (f.id !== friendId) return f;
        const nowFollowing = !f.isFollowing;
        return {
          ...f,
          isFollowing: nowFollowing,
          followersCount: nowFollowing ? f.followersCount + 1 : Math.max(0, f.followersCount - 1),
        };
      })
    );
    if (selectedFriendModal?.id === friendId) {
      setSelectedFriendModal(prev => prev ? { ...prev, isFollowing: !prev.isFollowing } : null);
    }
  };

  const updateGoalTarget = (goalId: string, delta: number) => {
    setGoals(prev =>
      prev.map(g => (g.id === goalId ? { ...g, targetCount: Math.max(1, g.targetCount + delta) } : g))
    );
  };

  const createShelf = (title: string, description: string, itemIds: string[]) => {
    const newShelf: CuratedShelf = {
      id: `shelf-${Date.now()}`,
      title,
      description,
      itemIds,
      isPublic: true,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setShelves(prev => [newShelf, ...prev]);
  };

  return (
    <RotationContext.Provider
      value={{
        mediaItems,
        socialFeed,
        friends,
        goals,
        shelves,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        searchQuery,
        setSearchQuery,
        theme,
        toggleTheme,
        selectedMediaModal,
        setSelectedMediaModal,
        selectedFriendModal,
        setSelectedFriendModal,
        isQuickLogOpen,
        setIsQuickLogOpen,
        isAddCustomOpen,
        setIsAddCustomOpen,
        updateProgress,
        addMediaItem,
        updateMediaItem,
        deleteMediaItem,
        changeMediaStatus,
        submitReview,
        toggleLikeActivity,
        addCommentToActivity,
        addToMyRotation,
        toggleFollowFriend,
        updateGoalTarget,
        createShelf,
      }}
    >
      {children}
    </RotationContext.Provider>
  );
};

export const useRotation = () => {
  const context = useContext(RotationContext);
  if (!context) {
    throw new Error('useRotation must be used within a RotationProvider');
  }
  return context;
};
