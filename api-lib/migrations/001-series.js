const { MongoClient } = require('mongodb');
const axios = require('axios');
require('dotenv').config();

console.log(process.env.MONGODB_URI);

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const tmdb_id = 1396;

    const MongoSeriesObjId = await getMongoObjId(client, 'tv_series', tmdb_id);
    if (MongoSeriesObjId) {
      console.log('series already in DB');
    } else {
      const seriesObj = await createSeriesObj(tmdb_id);
      await addObjToDB(client, 'tv_series', seriesObj);
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
  const seriesProperties = await parseSeriesData(seriesApiData);
  const seriesCreditsData = await getTmdbApiSeriesCreditsData(tmdb_id);
  const [seriesCast, seriesCrew] = await parseSeriesCredits(seriesCreditsData);
  seriesProperties['cast'] = seriesCast;
  seriesProperties['crew'] = seriesCrew;

  return seriesProperties;
};

const getTmdbApiSeriesData = async (tmdb_id) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdb_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );
    return resp.data;
  } catch (err) {
    console.error(err);
  }
};

const parseSeriesData = (seriesApiData) => {
  const seriesProperties = {
    backdrop_path: seriesApiData.backdrop_path,
    episode_run_time: seriesApiData.episode_run_time,
    first_air_date: seriesApiData.first_air_date,
    homepage: seriesApiData.homepage,
    in_production: seriesApiData.in_production,
    last_air_date: seriesApiData.last_air_date,
    name: seriesApiData.name,
    next_episode_to_air: seriesApiData.next_episode_to_air,
    number_of_episodes: seriesApiData.number_of_episodes,
    number_of_seasons: seriesApiData.number_of_seasons,
    original_name: seriesApiData.original_name,
    overview: seriesApiData.overview,
    popularity: seriesApiData.popularity,
    poster_path: seriesApiData.poster_path,
    seasons: [],
    status: seriesApiData.status,
    tagline: seriesApiData.tagline,
    tmdb_id: seriesApiData.id,
    type: seriesApiData.type,
  };

  seriesApiData.seasons.forEach((season) => {
    seriesProperties.seasons.push(season.id);
    console.log(season.id, season.name);
  });

  return seriesProperties;
};

const getTmdbApiSeriesCreditsData = async (tmdb_id) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdb_id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );
    return resp.data;
  } catch (err) {
    console.error(err);
  }
};

const parseSeriesCredits = async (seriesCreditsData) => {
  const cast = seriesCreditsData.cast;
  const crew = seriesCreditsData.crew;
  return [cast, crew];
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
};

main().catch(console.error);
