import { ObjectId } from 'mongodb';

const findSeriesById = async (db, idToSearch) => {
  const _id = ObjectId(idToSearch);
  return db
    .collection('tv_series')
    .findOne({ _id })
    .then((series) => series || null);
};

const findSeriesBySlug = async (db, slug) => {
  return db
    .collection('tv_series')
    .findOne({ slug })
    .then((series) => series || null);
};

const getSeriesByTmdbId = async (db, tmdb_id) => {
  return db
    .collection('tv_series')
    .findOne({ tmdb_id })
    .then((series) => series || null);
};

const getAllSeries = async (db) => {
  const cursor = db.collection('tv_series').find({});
  const allSeries = await cursor.toArray();
  return allSeries;
};

module.exports = {
  findSeriesById,
  findSeriesBySlug,
  getSeriesByTmdbId,
  getAllSeries,
};
