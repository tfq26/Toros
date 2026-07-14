import { 
  Trophy, 
  Dribbble, 
  Target, 
  Activity, 
  User as UserIcon,
  Zap
} from 'lucide-react';

export const SPORTS = [
  {
    id: 'soccer',
    name: 'Soccer',
    icon: '⚽',
    color: '#10b981', // Emerald
    rules: '2 halves, 45 mins each. Extra time if draw.',
    playersPerTeam: 11
  },
  {
    id: 'table-tennis',
    name: 'Table Tennis',
    icon: '🏓',
    color: '#f59e0b', // Amber
    rules: 'Best of 5 or 7 sets. 11 points per set.',
    playersPerTeam: 1
  },
  {
    id: 'tennis',
    name: 'Tennis',
    icon: '🎾',
    color: '#84cc16', // Lime
    rules: 'Sets, Games, Points (15, 30, 40).',
    playersPerTeam: 1
  },
  {
    id: 'football',
    name: 'Football',
    icon: '🏈',
    color: '#b91c1c', // Red
    rules: '4 quarters, 15 mins each. Touchdowns = 6 pts.',
    playersPerTeam: 11
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '🏀',
    color: '#f97316', // Orange
    rules: '4 quarters, 12 mins each. 2/3 pt shots.',
    playersPerTeam: 5
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    icon: '🏐',
    color: '#0ea5e9', // Sky
    rules: 'Best of 5 sets. 25 points per set (final set 15).',
    playersPerTeam: 6
  }
];
