import {
  CTFParticipation,
  PointsOverTime,
  SolveHistory,
  UserProfileResponse,
  UserStats,
} from '@/lib/types/profile';
import { getAuthenticatedAxios } from '../axios';

// Single fetch function for user profile data
const fetchUserProfileApi = async (
  username: string
): Promise<UserProfileResponse> => {
  const axios = await getAuthenticatedAxios();
  const res = await axios.get<UserProfileResponse>(
    `/info/user/${encodeURIComponent(username)}`
  );
  return res.data;
};

// ─── Derived data extractors ──────────────────────────────────

function deriveUserStats(data: UserProfileResponse): UserStats {
  const challenges = data.challenges || [];
  const categoryCounts: Record<string, number> = {};
  for (const c of challenges) {
    const cat = c.category || 'other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  }

  let favoriteCategory = 'None';
  let maxCount = 0;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      maxCount = count;
      favoriteCategory = cat;
    }
  }

  return {
    totalPoints: data.score ?? 0,
    rank: data.rank ?? 0,
    totalSolves: challenges.length,
    totalChallenges: challenges.length,
    solveRate: challenges.length > 0 ? 100 : 0,
    averageTimeToSolve: 0,
    favoriteCategory,
    categories: categoryCounts,
  };
}

function deriveSolveHistory(data: UserProfileResponse): SolveHistory[] {
  const challenges = data.challenges || [];
  return challenges.map((ch) => ({
    id: ch.id.toString(),
    challengeId: ch.id.toString(),
    challengeName: ch.name,
    points: ch.points,
    solvedAt: new Date(ch.solvedAt),
    category: ch.category,
  }));
}

function derivePointsOverTime(data: UserProfileResponse): PointsOverTime[] {
  const challenges = data.challenges || [];
  if (challenges.length === 0) return [];

  const sortedChallenges = [...challenges].sort(
    (a, b) => new Date(a.solvedAt).getTime() - new Date(b.solvedAt).getTime()
  );

  let cumulativePoints = 0;
  return sortedChallenges.map((ch) => {
    cumulativePoints += ch.points;
    return {
      date: new Date(ch.solvedAt),
      points: cumulativePoints,
    };
  });
}

// ─── Query factory: single API call, multiple derived queries ──

export const userProfileQuery = (username?: string) => ({
  queryKey: ['profile', 'user', username],
  queryFn: () => {
    if (!username) throw new Error('Username is required');
    return fetchUserProfileApi(username);
  },
  enabled: !!username,
});

export const userStatsQuery = (username?: string) => ({
  queryKey: ['profile', 'stats', username],
  queryFn: async (): Promise<UserStats> => {
    if (!username) {
      return {
        totalPoints: 0,
        rank: 0,
        totalSolves: 0,
        totalChallenges: 0,
        solveRate: 0,
        averageTimeToSolve: 0,
        favoriteCategory: 'None',
        categories: {},
      };
    }
    const data = await fetchUserProfileApi(username);
    return deriveUserStats(data);
  },
});

export const solveHistoryQuery = (username?: string) => ({
  queryKey: ['profile', 'solveHistory', username],
  queryFn: async (): Promise<SolveHistory[]> => {
    if (!username) return [];
    const data = await fetchUserProfileApi(username);
    return deriveSolveHistory(data);
  },
});

export const pointsOverTimeQuery = (username?: string) => ({
  queryKey: ['profile', 'pointsOverTime', username],
  queryFn: async (): Promise<PointsOverTime[]> => {
    if (!username) return [];
    const data = await fetchUserProfileApi(username);
    return derivePointsOverTime(data);
  },
});

export const ctfParticipationQuery = () => ({
  queryKey: ['profile', 'ctfParticipation'],
  queryFn: async (): Promise<CTFParticipation[]> => {
    // CTF participation endpoint not yet available
    return [];
  },
});

// For backward compatibility
export const userStatsServerQuery = userStatsQuery;
export const solveHistoryServerQuery = solveHistoryQuery;
export const pointsOverTimeServerQuery = pointsOverTimeQuery;
export const ctfParticipationServerQuery = ctfParticipationQuery;
