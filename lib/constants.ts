export const ENVIROMENT = process.env.NODE_ENV;

export const BACKEND_URL =
  (ENVIROMENT === 'development'
    ? process.env.NEXT_PUBLIC_BACKEND_URI_DEV
    : process.env.NEXT_PUBLIC_BACKEND_URI_PROD
  )?.replace(/\/+$/, '') || 'http://localhost:5005';

export const API_BASE_URL = `${BACKEND_URL}/api`;
export const AUTH_BASE_URL = `${BACKEND_URL}/auth`;

export const LEADERBOARD_TABLE_PAGE_LIMIT = 10;
export const USERS_TABLE_PAGE_LIMIT = 15;
export const SUBMISSIONS_TABLE_PAGE_LIMIT = 15;
export const CHALLENGE_SUBMISSIONS_TABLE_PAGE_LIMIT = 10;
