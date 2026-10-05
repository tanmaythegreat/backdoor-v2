import {
  ChallengeDetailsWithActions,
  ChallengeSubmissionsStatistics,
  ChallengeSubmissionsTable,
  ChallengeDetailsWithActionsSkeleton,
  ChallengeSubmissionTableSkeleton,
  ChallengeSubmissionsStatisticsSkeleton,
} from '@/components/challenge';
import { challengeDetailsQuery } from '@/lib/api/challenge';
import { getQueryClient } from '@/lib/query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';

const ChallengeDetailsPage = async ({
  params,
}: {
  params: Promise<{ name: string }>;
}) => {
  const { name } = await params;

  const queryClient = getQueryClient();
  queryClient.prefetchQuery(challengeDetailsQuery(name));

  return (
    <div className="w-full flex flex-col gap-4 p-5">
      <Suspense fallback={<ChallengeDetailsWithActionsSkeleton />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <ChallengeDetailsWithActions name={name} />
        </HydrationBoundary>
      </Suspense>
      <div className="flex flex-row gap-4">
        <div className="basis-1/2">
          <Suspense fallback={<ChallengeSubmissionTableSkeleton />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <ChallengeSubmissionsTable name={name} />
            </HydrationBoundary>
          </Suspense>
        </div>
        <div className="basis-1/2">
          <Suspense fallback={<ChallengeSubmissionsStatisticsSkeleton />}>
            <HydrationBoundary state={dehydrate(queryClient)}>
              <ChallengeSubmissionsStatistics name={name} />
            </HydrationBoundary>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetailsPage;
