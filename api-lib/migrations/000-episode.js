// const { MongoClient } = require('mongodb');
const axios = require('axios');
const slugify = require('slugify');
require('dotenv').config();

const updateEpisode = async (
  client,
  series_tmdb_id,
  season_number,
  episode_number,
  approved_specials
) => {
  // const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    // await client.connect();

    const series = await searchByTmdbId(client, 'tv_series', series_tmdb_id);
    const season = await getSeason(
      client,
      'tv_seasons',
      series._id,
      season_number
    );
    const episodeData = await getTmdbEpisodeData(
      series_tmdb_id,
      season_number,
      episode_number
    );
    episodeData.series_id = series._id;
    episodeData.season_id = season._id;

    if (approved_specials.includes(episodeData.tmdb_id)) {
      await upsertObjToDB(client, 'tv_episodes', episodeData);
    }
  } catch (e) {
    console.error(e);
  } finally {
    // console.log('Client closed');
    // client.close();
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

const getSeason = async (client, collection, series_id, season_number) => {
  try {
    const result = await client
      .db('production0')
      .collection(collection)
      .findOne({ series_id: series_id, season_number: season_number });
    return result;
  } catch (err) {
    console.error(err);
  }
};

const getTmdbEpisodeData = async (
  series_tmdb_id,
  season_number,
  episode_number
) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${series_tmdb_id}/season/${season_number}/episode/${episode_number}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );
    const data = resp.data;
    const seriesProperties = {
      air_date: data.air_date,
      crew: data.crew,
      episode_number: data.episode_number,
      guest_stars: data.guest_stars,
      name: data.name,
      overview: data.overview,
      production_code: data.production_code,
      season_number: data.season_number,
      series_tmdb_id: series_tmdb_id,
      still_path: data.still_path,
      slug: slugify(String(episode_number).padStart(2, '0') + '-' + data.name, {
        lower: true,
        strict: true,
      }),
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
      .updateOne({ tmdb_id: data.tmdb_id }, { $set: data }, { upsert: true });
    return result.insertedId;
  } catch (err) {
    console.error(err);
  }
};

module.exports = { updateEpisode };

// updateEpisode(1396, 1, 1).catch(console.error);
