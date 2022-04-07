import { fetcher } from '@/lib/fetch';
import useSWRInfinite from 'swr/infinite';

export function useAllUserSeriesRatings({ user_id, limit = 60 } = {}) {
  const { data, error, size, ...props } = useSWRInfinite(
    (index, previousPageData) => {
      // reached the end
      if (previousPageData && previousPageData.seriesList.length === 0)
        return null;

      const searchParams = new URLSearchParams();
      searchParams.set('limit', limit);

      if (index !== 0) {
        // using last series popularity as cursor
        // We want to fetch series which have a popularity that is
        // lower than the last series popularity
        const before =
          previousPageData.seriesList[previousPageData.seriesList.length - 1]
            .popularity;
        searchParams.set('before', before);
      }

      return `/api/user/${user_id}/rating/series?${searchParams.toString()}`;
    },
    fetcher,
    {
      refreshInterval: 10000,
      revalidateAll: false,
    }
  );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');
  const isEmpty = data?.[0]?.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.seriesList?.length < limit);

  return {
    data,
    error,
    size,
    isLoadingMore,
    isReachingEnd,
    ...props,
  };
}
