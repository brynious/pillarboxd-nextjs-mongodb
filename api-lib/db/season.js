// import { findSeriesBySlug } from '@/api-lib/db';

export async function findSeasonBySlug(db, series, seasonSlug) {
  // const series = await findSeriesBySlug(db, seriesSlug);

  const season = await db
    .collection('tv_seasons')
    .findOne({ series_id: series._id, slug: seasonSlug })
    .then((series) => series || null);

  return season;
}

export async function getSeasonsBySeriesId(db, series_id) {
  const seasons = [];

  const seasonsPromise = db
    .collection('tv_seasons')
    .find({ series_id: series_id });

  while (await seasonsPromise.hasNext()) {
    seasons.push(await seasonsPromise.next());
  }
  return seasons;
}
