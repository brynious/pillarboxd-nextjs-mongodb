const { MongoClient } = require('mongodb');
const axios = require('axios');
const slugify = require('slugify');
require('dotenv').config();

const { findOrCreateSeries } = require('../db/helpers/tvSeries');

const main = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const tmdb_id = 1396;
    const series_id = await findOrCreateSeries(client, tmdb_id);
    const series_obj = await getMongoObjById(client, 'tv_series', series_id);
    const season_id = await createOrUpdateSeasons(client, series_obj);
    // console.log({ season_id });
  } catch (e) {
    console.error(e);
  } finally {
    console.log('Client theoretically should close here, if it weren't broken. To fix.');
    // client.close();
  }
};

const getMongoObjById = async (client, collection, mongo_id) => {
  const result = await client
    .db('production0')
    .collection(collection)
    .findOne({ _id: mongo_id });
  return result;
};

const createOrUpdateSeasons = async (client, series_obj) => {
  const series_tmdb_id = series_obj.tmdb_id;
  series_obj.seasons.forEach(async (season) => {
    const season_number = season.season_number;
    const seasonObj = await getTmdbSeasonData(series_tmdb_id, season_number);
    seasonObj['series_id'] = series_obj._id;
    const [seasonCast, seasonCrew] = await getTmdbSeasonCredits(
      series_tmdb_id,
      season_number
    );
    seasonObj['cast'] = seasonCast;
    seasonObj['crew'] = seasonCrew;

    const seasonId = await upsertObjToDB(client, 'tv_season', seasonObj);
    return seasonId;
  });
};

const getTmdbSeasonCredits = async (series_tmdb_id, season_number) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${series_tmdb_id}/season/${season_number}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );

    const cast = resp.data.cast;
    const crew = resp.data.crew;
    return [cast, crew];
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
      episodes: [],
      name: data.name,
      overview: data.overview,
      poster_path: data.poster_path,
      season_number: data.season_number,
      slug: slugify(data.name, { lower: true }),
      tmdb_id: data.id,
    };
    await data.episodes.forEach((episode) => {
      seriesProperties.episodes.push(episode.episode_number);
    });
    return seriesProperties;
  } catch (err) {
    console.error(err);
  }
};

// const addObjToDB = async (client, collection, newListing) => {
//   try {
//     console.log('Creating series', newListing.name);
//     const result = await client
//       .db('production0')
//       .collection(collection)
//       .insertOne(newListing);
//     console.log(
//       `New series ${newListing.name} created with the following id: ${result.insertedId}`
//     );
//     return result.insertedId;
//   } catch (err) {
//     console.error(err);
//   }
// };

const upsertObjToDB = async (client, collection, newListing) => {
  try {
    console.log(`Upserting ${collection} ${newListing.name}`);
    const result = await client
      .db('production0')
      .collection(collection)
      .replaceOne({ tmdb_id: newListing.tmdb_id }, newListing, {
        upsert: true,
      });
    console.log(
      `New item ${newListing.name} created with the following id: ${result.insertedId}`
    );
    return result.insertedId;
  } catch (err) {
    console.error(err);
  }
};

main().catch(console.error);
