const { MongoClient } = require('mongodb');
const axios = require('axios');
require('dotenv').config();

const main = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const tmdb_id = 1396;

    const series = await client
      .db('production0')
      .collection('tv_series')
      .findOne({ tmdb_id: tmdb_id });
    console.log(`Series: ${series._id}`);

    const seasons = [];

    const seasonsPromise = client
      .db('production0')
      .collection('tv_seasons')
      .find({ series_id: series._id });

    while (await seasonsPromise.hasNext()) {
      seasons.push(await seasonsPromise.next());
    }

    for (const season of seasons) {
      console.log(season.name, season._id);
    }
  } catch (e) {
    console.error(e);
  } finally {
    // console.log('Client would close here but needs fix.');
    console.log('Client closed.');
    client.close();
  }
};

main().catch(console.error);
