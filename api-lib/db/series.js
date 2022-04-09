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

export async function getSeriesByTmdbId(db, tmdb_id) {
  return db
    .collection('tv_series')
    .findOne({ tmdb_id })
    .then((series) => series || null);
}

export async function getAllSeries(db) {
  const cursor = db.collection('tv_series').find(
    {},
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
  );
  const allSeries = await cursor.toArray();
  return allSeries;
}

export async function findSeries(db, before, limit = 10) {
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
    ])
    .toArray();
}
