import { findSeriesBySlug } from '@/api-lib/db';

export async function findSeasonBySlug(db, seriesSlug, seasonSlug) {
  const series = await findSeriesBySlug(db, seriesSlug);

  const season = await db
    .collection('tv_season')
    .findOne({ series_id: series._id, slug: seasonSlug })
    .then((series) => series || null);

  return [series, season];
}
