import { ChallengeSolveResp } from './challenge';

export interface UserProfileResponse {
  id: number;
  username: string;
  role: string;
  status: number;
  score: number;
  rank: number;
  email: string;
  challenges: ChallengeSolveResp[];
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastActive: string;
  bio: string;
  socialLinks: {
    github?: string;
    twitter?: string;
    website?: string;
  };
  stats: UserStats;
}

export interface UserStats {
  totalPoints: number;
  rank: number;
  totalSolves: number;
  totalChallenges: number;
  solveRate: number;
  averageTimeToSolve: number;
  favoriteCategory: string;
  categories: {
    [key: string]: number;
  };
}

export interface SolveHistory {
  id: string;
  challengeId: string;
  challengeName: string;
  points: number;
  solvedAt: Date;
  category: string;
}

export interface CTFParticipation {
  id: string;
  name: string;
  points: number;
  position: number;
  flagsSubmitted: number;
  timestampStart: Date;
  timestampEnd: Date;
}

export interface PointsOverTime {
  date: Date;
  points: number;
}
