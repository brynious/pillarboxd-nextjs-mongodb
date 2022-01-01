const findSeriesById = async (db, seriesId) => {
  return db
    .collection('tv_series')
    .findOne({ _id: seriesId })
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

module.exports = { findSeriesById, findSeriesBySlug, getSeriesByTmdbId };
