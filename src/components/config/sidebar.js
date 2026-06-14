import { HomeIcon, BoltIcon, SparklesIcon } from '@heroicons/react/24/outline';

export const SIDEBAR_CONFIG = [
  {
    id: 'home',
    label: 'Home',
    icon: HomeIcon, // pass component directly
    path: '/',
  },
  {
    id: 'shorts',
    label: 'Shorts',
    icon: BoltIcon,
    path: '/shorts',
  },
  {
    id: 'AISummary',
    label: 'AI Summary',
    icon: SparklesIcon,
    path: '/ai-summary',
  },
  // {
  //   id: 'library',
  //   label: 'Library',
  //   icon: FolderIcon,
  //   children: [
  //     {
  //       id: 'watch-later',
  //       label: 'Watch Later',
  //       icon: ClockIcon,
  //       path: '/watch-later',
  //     },
  //   ],
  // },
  // {
  //   id: 'explore',
  //   label: 'Explore',
  //   icon: FolderIcon,
  //   children: [
  //     {
  //       id: 'music',
  //       label: 'Music',
  //       icon: MusicalNoteIcon,
  //       path: '/category/music',
  //     },
  //     {
  //       id: 'gaming',
  //       label: 'Gaming',
  //       icon: PuzzlePieceIcon,
  //       path: '/category/gaming',
  //     },
  //     {
  //       id: 'sports',
  //       label: 'Sports',
  //       icon: TrophyIcon,
  //       path: '/category/sports',
  //     },
  //     {
  //       id: 'movies',
  //       label: 'Movies',
  //       icon: FilmIcon,
  //       path: '/category/movies',
  //     },
  //     {
  //       id: 'live',
  //       label: 'Live',
  //       icon: SignalIcon,
  //       path: '/category/live',
  //     },
  //   ],
  // },
];
