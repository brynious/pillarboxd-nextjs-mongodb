const { MongoClient } = require('mongodb');
// const axios = require('axios');
require('dotenv').config();

const { createSeriesObj } = require('../db/tmdb/series');
const { getSeriesByTmdbId } = require('../db/series.js');

const main = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const seriesTmdbIds = [1396, 54344];

    const test = await client
      .collection('tv_series')
      .findOne(1396)
      .then((series) => series || null);
    console.log({ test });

    for (const tmdb_id of seriesTmdbIds) {
      await refreshSeries(client, tmdb_id);
    }

    // console.log({ season_id });
  } catch (e) {
    console.error(e);
  } finally {
    client.close();
    console.log('Client closed');
  }
};

const refreshSeries = async (client, tmdb_id) => {
  // const seriesIdIfInDb = await getSeriesByTmdbId(db, tmdb_id);
  console.log({ tmdb_id });
  console.log({ client });

  const check = await client
    .collection('tv_series')
    .findOne({ tmdb_id })
    .then((series) => series || null);
  console.log({ check });
};

main().catch(console.error);
