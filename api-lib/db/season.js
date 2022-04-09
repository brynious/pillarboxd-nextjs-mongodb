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
  const cursor = db.collection('tv_seasons').find(
    { series_id: series_id },
    {
      projection: {
        air_date: 1,
        cast: 1,
        name: 1,
        overview: 1,
        popularity: 1,
        poster_path: 1,
        season_number: 1,
        series_id: 1,
        slug: 1,
        tmdb_id: 1,
      },
    }
  );
  const seasons = await cursor.toArray();
  return seasons;
}
