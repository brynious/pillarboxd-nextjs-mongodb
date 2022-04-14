import { fetcher } from '@/lib/fetch';
import useSWRInfinite from 'swr/infinite';

export function useUserSeasonsByYear({ user_id, year, limit = 60 } = {}) {
  const { data, error, size, ...props } = useSWRInfinite(
    (index, previousPageData) => {
      // reached the end
      if (previousPageData && previousPageData.season_list.length === 0)
        return null;

      const searchParams = new URLSearchParams();
      searchParams.set('limit', limit);
      searchParams.set('year', year);

      if (index !== 0) {
        // using last series popularity as cursor
        // We want to fetch series which have a popularity that is
        // lower than the last series popularity
        const before =
          previousPageData.season_list[previousPageData.season_list.length - 1]
            .popularity;
        searchParams.set('before', before);
      }

      return `/api/user/${user_id}/seasons?${searchParams.toString()}`;
    },
    fetcher,
    {
      refreshInterval: 10000000,
      revalidateAll: false,
    }
  );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.season_list?.length < limit);

  return {
    data,
    error,
    size,
    isLoadingMore,
    isReachingEnd,
    ...props,
  };
}
