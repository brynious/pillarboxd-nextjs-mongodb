import { ObjectId } from 'mongodb';

export async function findSeriesById(db, idToSearch) {
  const _id = ObjectId(idToSearch);
  return db
    .collection('tv_series')
    .findOne(
      { _id },
      {
        projection: {
          tmdb_id: 1,
          approved_specials: 1,
          backdrop_path: 1,
          cast: 1,
          name: 1,
          overview: 1,
          popularity: 1,
          poster_path: 1,
          slug: 1,
        },
      }
    )
    .then((series) => series || null);
}

export async function findSeriesBySlug(db, slug) {
  return db
    .collection('tv_series')
    .findOne(
      { slug },
      {
        projection: {
          approved_specials: 1,
          backdrop_path: 1,
          cast: 1,
          first_air_date: 1,
          last_air_date: 1,
          name: 1,
          overview: 1,
          popularity: 1,
          poster_path: 1,
          slug: 1,
          status: 1,
          tmdb_id: 1,
        },
      }
    )
    .then((series) => series || null);
}

export async function getSeriesByTmdbId(db, tmdb_id) {
  return db
    .collection('tv_series')
    .findOne({ tmdb_id })
    .then((series) => series || null);
}

export async function getAllSeries(db, before, limit = 60) {
  return db
    .collection('tv_series')
    .aggregate([
      {
        $match: {
          ...(before && { popularity: { $lt: before } }),
        },
      },
      { $sort: { popularity: -1 } },
      { $limit: limit },
      {
        $project: {
          tmdb_id: 1,
          name: 1,
          popularity: 1,
          poster_path: 1,
          slug: 1,
        },
      },
    ])
    .toArray();
}
