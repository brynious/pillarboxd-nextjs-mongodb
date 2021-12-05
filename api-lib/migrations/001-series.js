const { MongoClient } = require('mongodb');
const axios = require('axios');
require('dotenv').config();

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const tmdb_id = 1396;
    const db_series_obj = await getMongoObjId(client, 'tv_series', tmdb_id);
    let db_series_obj_id;

    if (db_series_obj) {
      // db_series_obj_id = db_series_obj._id;
      console.log(`Series already in DB: ${db_series_obj._id}`);
    } else {
      const seriesObj = await createSeriesObj(tmdb_id);
      db_series_obj_id = await addObjToDB(client, 'tv_series', seriesObj);
      console.log(`Series added to DB: ${db_series_obj_id}`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

const getMongoObjId = async (client, collection, tmdb_id) => {
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

const createSeriesObj = async (tmdb_id) => {
  const seriesApiData = await getTmdbApiSeriesData(tmdb_id);
  const [seriesCast, seriesCrew] = await getTmdbApiSeriesCreditsData(tmdb_id);
  seriesApiData['cast'] = seriesCast;
  seriesApiData['crew'] = seriesCrew;

  return seriesApiData;
};

const getTmdbApiSeriesData = async (tmdb_id) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdb_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );
    const data = resp.data;
    const seriesProperties = {
      backdrop_path: data.backdrop_path,
      episode_run_time: data.episode_run_time,
      first_air_date: data.first_air_date,
      homepage: data.homepage,
      in_production: data.in_production,
      last_air_date: data.last_air_date,
      name: data.name,
      next_episode_to_air: data.next_episode_to_air,
      number_of_episodes: data.number_of_episodes,
      number_of_seasons: data.number_of_seasons,
      original_name: data.original_name,
      overview: data.overview,
      popularity: data.popularity,
      poster_path: data.poster_path,
      seasons: [],
      status: data.status,
      tagline: data.tagline,
      tmdb_id: data.id,
      type: data.type,
    };
    data.seasons.forEach((season) => {
      seriesProperties.seasons.push(season.id);
      console.log(season.id, season.name);
    });
    return seriesProperties;
  } catch (err) {
    console.error(err);
  }
};

const getTmdbApiSeriesCreditsData = async (tmdb_id) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdb_id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );
    // return resp.data;

    const cast = resp.data.cast;
    const crew = resp.data.crew;
    return [cast, crew];
  } catch (err) {
    console.error(err);
  }
};

const addObjToDB = async (client, collection, newListing) => {
  console.log('Creating series', newListing.name);
  const result = await client
    .db('production0')
    .collection(collection)
    .insertOne(newListing);
  console.log(
    `New series ${newListing.name} created with the following id: ${result.insertedId}`
  );
  return result.insertedId;
};

main().catch(console.error);
