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
  const cursor = db.collection('tv_series').find({ series_id: series_id });
  const seasons = await cursor.toArray();
  return seasons;
}
