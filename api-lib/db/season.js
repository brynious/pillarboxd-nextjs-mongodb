import { findSeriesBySlug } from '@/api-lib/db';

export async function findSeasonBySlug(db, seriesSlug, seasonSlug) {
  const series = await findSeriesBySlug(db, seriesSlug);

  const season = await db
    .collection('tv_season')
    .findOne({ series_id: series._id, slug: seasonSlug })
    .then((series) => series || null);

  return [series, season];
}

export async function getSeasonsBySeriesId(db, series_id) {
  const seasons = [];

  const seasonsPromise = db
    .collection('tv_season')
    .find({ series_id: series_id });

  while (await seasonsPromise.hasNext()) {
    seasons.push(await seasonsPromise.next());
  }
  return seasons;
}
