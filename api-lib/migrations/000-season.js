const { MongoClient } = require('mongodb');
const axios = require('axios');
const slugify = require('slugify');
require('dotenv').config();

const updateSeason = async (client, series_tmdb_id, season_number) => {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const series = await searchByTmdbId(client, 'tv_series', series_tmdb_id);
    const seasonData = await getTmdbSeasonData(series_tmdb_id, season_number);
    seasonData.series_id = series._id;
    await upsertObjToDB(client, 'tv_seasons', seasonData);
    return seasonData;
  } catch (e) {
    console.error(e);
  }
};

const searchByTmdbId = async (client, collection, tmdb_id) => {
  try {
    const result = await client
      .db('production0')
      .collection(collection)
      .findOne({ tmdb_id: tmdb_id });
    return result;
  } catch (err) {
    console.error(err);
  }
};

const getTmdbSeasonData = async (series_tmdb_id, season_number) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${series_tmdb_id}/season/${season_number}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );
    const data = resp.data;
    const seriesProperties = {
      air_date: data.air_date,
      episodes: data.episodes.map((episode) => {
        const episodeObj = {
          episode_number: episode.episode_number,
          name: episode.name,
          production_code: episode.production_code,
          tmdb_id: episode.id,
        };
        return episodeObj;
      }),
      name: data.name,
      overview: data.overview,
      poster_path: data.poster_path,
      season_number: data.season_number,
      slug: slugify(data.name, { lower: true }),
      tmdb_id: data.id,
    };
    return seriesProperties;
  } catch (err) {
    console.error(err);
  }
};

const upsertObjToDB = async (client, collection, data) => {
  try {
    console.log(`Upserting ${collection} ${data.name}`);
    const result = await client
      .db('production0')
      .collection(collection)
      .replaceOne({ tmdb_id: data.tmdb_id }, data, {
        upsert: true,
      });
    return result.insertedId;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { updateSeason };