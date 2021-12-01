const { MongoClient } = require('mongodb');
const axios = require('axios');
require('dotenv').config();

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const series_id = 61118;

    const seriesApiData = await getTmdbApiSeriesData(series_id);
    const seriesProperties = await parseSeriesData(seriesApiData);

    // Initialise data
    await createSeries(client, seriesProperties);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function createSeries(client, newListing) {
  console.log('creating listing with', newListing.name);
  const result = await client
    .db('production0')
    .collection('tv_series')
    .insertOne(newListing);
  console.log(
    `New listing created with the following id: ${result.insertedId}`
  );
}

const getTmdbApiSeriesData = async (series_id) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${series_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );
    return resp;
  } catch (err) {
    console.error(err);
  }
};

const parseSeriesData = (seriesApiData) => {
  const {
    backdrop_path,
    first_air_date,
    in_production,
    name,
    overview,
    poster_path,
  } = seriesApiData.data;
  return {
    backdrop_path,
    first_air_date,
    in_production,
    name,
    overview,
    poster_path,
  };
};

main().catch(console.error);
