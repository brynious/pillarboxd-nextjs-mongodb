import { fetcher } from '@/lib/fetch';
import useSWRInfinite from 'swr/infinite';

export function useAllUserSeriesRatings({ user_id, limit = 30 } = {}) {
  const { data, error, size, ...props } = useSWRInfinite(
    (index, previousPageData) => {
      // reached the end
      if (previousPageData && previousPageData.seriesList.length === 0)
        return null;

      const searchParams = new URLSearchParams();
      searchParams.set('limit', limit);

      if (index !== 0) {
        // Using last series score and ratedAt as cursor,
        // we want to fetch series which have an equal or
        // lower score and, following that, a lower ratedAt
        // value than the last series
        const beforeScore =
          previousPageData.seriesList[previousPageData.seriesList.length - 1]
            .score;
        searchParams.set('beforeScore', beforeScore);

        const beforeRatedAt =
          previousPageData.seriesList[previousPageData.seriesList.length - 1]
            .ratedAt;
        searchParams.set('beforeRatedAt', beforeRatedAt);
      }

      return `/api/user/${user_id}/rating/series?${searchParams.toString()}`;
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

export function useAllUserSeasonRatings({ user_id, year, limit = 30 } = {}) {
  const { data, error, size, ...props } = useSWRInfinite(
    (index, previousPageData) => {
      // reached the end
      if (previousPageData && previousPageData.season_list.length === 0)
        return null;

      const searchParams = new URLSearchParams();
      searchParams.set('limit', limit);

      if (year) searchParams.set('year', year);

      if (index !== 0) {
        // Using last season score and ratedAt as cursor,
        // we want to fetch seasons which have an equal or
        // lower score and, following that, a lower ratedAt
        // value than the last season
        const beforeScore =
          previousPageData.season_list[previousPageData.season_list.length - 1]
            .score;
        searchParams.set('beforeScore', beforeScore);

        const beforeRatedAt =
          previousPageData.season_list[previousPageData.season_list.length - 1]
            .ratedAt;
        searchParams.set('beforeRatedAt', beforeRatedAt);
      }

      return `/api/user/${user_id}/rating/season?${searchParams.toString()}`;
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
