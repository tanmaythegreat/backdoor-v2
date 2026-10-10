'use server';

import { getAuthenticatedAxios } from '../axios';
import { UserProfile, UserProfileResponse } from '@/lib/types/profile';
import { cookies } from 'next/headers';
import { AxiosError } from 'axios';

function mapBackendUserToUserProfile(data: UserProfileResponse): UserProfile {
  const challenges = data.challenges || [];

  const dates = challenges
    .map((c) => new Date(c.solvedAt).getTime())
    .filter((t) => !isNaN(t));

  const earliestDate =
    dates.length > 0 ? new Date(Math.min(...dates)) : new Date();
  const latestDate =
    dates.length > 0 ? new Date(Math.max(...dates)) : new Date();

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
    id: data.id.toString(),
    username: data.username,
    name: data.username,
    email: data.email,
    avatar: '/profile-placeholder.svg',
    role: data.role === 'admin' ? 'admin' : 'user',
    createdAt: earliestDate.toISOString(),
    lastActive: latestDate.toISOString(),
    bio: '',
    socialLinks: {},
    stats: {
      totalPoints: data.score ?? 0,
      rank: data.rank ?? 0,
      totalSolves: challenges.length,
      totalChallenges: challenges.length,
      solveRate: challenges.length > 0 ? 100 : 0,
      averageTimeToSolve: 0,
      favoriteCategory,
      categories: categoryCounts,
    },
  };
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth')?.value;
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
    // Beast backend JWT claims uses `usr` for username
    const username = payload.usr || payload.username || payload.sub;

    if (!username) return null;
    return await getUserProfile(username);
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function getUserProfile(
  username?: string
): Promise<UserProfile | null> {
  console.log('ggggggggggggggggggg ', username);
  if (!username) {
    return null;
  }

  try {
    const axios = await getAuthenticatedAxios();
    const res = await axios.get<UserProfileResponse>(
      `/info/user/${encodeURIComponent(username)}`
    );

    if (!res.data) {
      return null;
    }

    return mapBackendUserToUserProfile(res.data);
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }
    console.error(`Error fetching profile for user ${username}:`, error);
    return null;
  }
}
