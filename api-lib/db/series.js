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

const getAllSeries = async (db) => {
  const series = [];

  const seriesPromise = db.collection('tv_series').find({});

  while (await seriesPromise.hasNext()) {
    series.push(await seriesPromise.next());
  }
  return series;
};

export async function getEpisodesBySeasonId(db, season_id) {
  const episodes = [];

  const episodesPromise = db
    .collection('tv_episodes')
    .find({ season_id: season_id });

  while (await episodesPromise.hasNext()) {
    episodes.push(await episodesPromise.next());
  }
  return episodes;
}

module.exports = {
  findSeriesById,
  findSeriesBySlug,
  getSeriesByTmdbId,
  getAllSeries,
};
