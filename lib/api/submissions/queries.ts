import {
  ChallengeCategory,
  ChallengeTag,
  Submission,
  SubmissionResp,
} from '@/lib/types';
import {
  CHALLENGE_SUBMISSIONS_TABLE_PAGE_LIMIT,
  SUBMISSIONS_TABLE_PAGE_LIMIT,
} from '@/lib/constants';
import { getAuthenticatedAxios } from '../axios';

const fetchSubmissions = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<{ data: Submission[]; total: number }> => {
  const axios = await getAuthenticatedAxios();
  const response = await axios.get<SubmissionResp[]>('/admin/submissions');
  const submissions = response.data;

  const skip = (page - 1) * limit;
  const data = submissions.slice(skip, skip + limit);

  // Convert date into readable format
  const filteredData = data.map(
    (submission) =>
      ({
        userId: submission.user_id,
        username: submission.username,
        challId: submission.chall_id,
        name: submission.name,
        category: submission.category as ChallengeCategory,
        tags: submission.tags as ChallengeTag[],
        points: submission.points,
        solvedAt: new Date(submission.submitted_at),
        flag: submission.flag,
        correct: submission.success,
      }) as Submission
  );
  const total = submissions.length;
  return { data: filteredData, total };
};

const fetchSubmissionsByChallenge = async ({
  challengeId,
  page,
  limit,
}: {
  challengeId: string;
  page: number;
  limit: number;
}): Promise<{ data: Submission[]; total: number }> => {
  const axios = await getAuthenticatedAxios();
  const response = await axios.get<SubmissionResp[]>(
    `/info/submissions/challenge/${challengeId}`
  );
  const submissions = response.data;

  const skip = (page - 1) * limit;
  const data = submissions.slice(skip, skip + limit);

  // Convert date into readable format
  const filteredData = data.map(
    (submission) =>
      ({
        userId: submission.user_id,
        username: submission.username,
        challId: submission.chall_id,
        name: submission.name,
        category: submission.category as ChallengeCategory,
        tags: submission.tags as ChallengeTag[],
        points: submission.points,
        solvedAt: new Date(submission.submitted_at),
        flag: submission.flag,
        correct: submission.success,
      }) as Submission
  );
  const total = submissions.length;
  return { data: filteredData, total };
};

export const submissionsTableQuery = ({
  page = 1,
  limit = SUBMISSIONS_TABLE_PAGE_LIMIT,
}: {
  page?: number;
  limit?: number;
} = {}) => {
  return {
    queryKey: ['submissions', { page, limit }],
    queryFn: () => fetchSubmissions({ page, limit }),
    refetchInterval: 1000 * 60 * 2, // refetch every 2 minutes
  };
};

export const submissionsByChallengeTableQuery = ({
  challengeId = '',
  page = 1,
  limit = CHALLENGE_SUBMISSIONS_TABLE_PAGE_LIMIT,
}: {
  challengeId?: string;
  page?: number;
  limit?: number;
} = {}) => {
  return {
    queryKey: ['submissions', challengeId, { page, limit }],
    queryFn: () => fetchSubmissionsByChallenge({ challengeId, page, limit }),
    refetchInterval: 1000 * 60 * 2, // refetch every 2 minutes
  };
};

// For backward compatibility
export const submissionsTableServerQuery = submissionsTableQuery;
export const submissionsByChallengeTableServerQuery =
  submissionsByChallengeTableQuery;
