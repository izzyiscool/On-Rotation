import React from 'react';
import { BookOpen, Tv, Film, Disc, Radio, Gamepad2 } from 'lucide-react';
import { MediaType } from '../types/media';

interface MediaIconProps {
  type: MediaType;
  className?: string;
}

export const MediaIcon: React.FC<MediaIconProps> = ({ type, className = 'w-4 h-4' }) => {
  switch (type) {
    case 'book':
      return <BookOpen className={className} />;
    case 'tv':
      return <Tv className={className} />;
    case 'movie':
      return <Film className={className} />;
    case 'music':
      return <Disc className={className} />;
    case 'podcast':
      return <Radio className={className} />;
    case 'game':
      return <Gamepad2 className={className} />;
    default:
      return <Disc className={className} />;
  }
};
