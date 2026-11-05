import React from 'react';
import { RotationProvider, useRotation } from './context/RotationContext';
import { Header } from './components/Header';
import { CurrentlyRotatingTray } from './components/CurrentlyRotatingTray';
import { LibraryView } from './components/LibraryView';
import { SocialFeed } from './components/SocialFeed';
import { StatsDashboard } from './components/StatsDashboard';
import { ListsView } from './components/ListsView';
import { ExploreView } from './components/ExploreView';
import { MediaDetailModal } from './components/MediaDetailModal';
import { FriendProfileModal } from './components/FriendProfileModal';
import { QuickLogModal } from './components/QuickLogModal';

const AppContent: React.FC = () => {
  const { activeTab } = useRotation();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors duration-200">
      {/* 3-Zone Top Bar Navigation */}
      <Header />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'rotation' && <CurrentlyRotatingTray />}
        {activeTab === 'library' && <LibraryView />}
        {activeTab === 'feed' && <SocialFeed />}
        {activeTab === 'discover' && <ExploreView />}
        {activeTab === 'stats' && <StatsDashboard />}
        {activeTab === 'shelves' && <ListsView />}
      </main>

      {/* Overlays & Modals */}
      <MediaDetailModal />
      <FriendProfileModal />
      <QuickLogModal />

      {/* Clean Editorial Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-900 bg-white/80 dark:bg-neutral-950/80 py-6 mt-12 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold text-neutral-700 dark:text-neutral-400">On Rotation</span>
            <span aria-hidden="true">·</span>
            <span>All-in-one entertainment tracking & social circles</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-500">
            <span>Books</span>
            <span aria-hidden="true">·</span>
            <span>Television</span>
            <span aria-hidden="true">·</span>
            <span>Cinema</span>
            <span aria-hidden="true">·</span>
            <span>Music</span>
            <span aria-hidden="true">·</span>
            <span>Podcasts</span>
            <span aria-hidden="true">·</span>
            <span>Video Games</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <RotationProvider>
      <AppContent />
    </RotationProvider>
  );
}
