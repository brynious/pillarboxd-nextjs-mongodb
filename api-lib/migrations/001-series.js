const { MongoClient } = require('mongodb');
const axios = require('axios');
require('dotenv').config();

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    await listDatabases(client);

    const series_id = 61118;

    // get series data from TMDB API
    const seriesApiData = await axios.get(
      `https://api.themoviedb.org/3/tv/${series_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );

    let {
      backdrop_path,
      first_air_date,
      in_production,
      name,
      overview,
      poster_path,
    } = seriesApiData.data;

    // Initialise data
    await createListing(client, {
      name,
      overview,
      poster_path,
      id: series_id,
      in_production,
      backdrop_path,
      first_air_date,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

async function listDatabases(client) {
  let databasesList = await client.db().admin().listDatabases();

  console.log('Databases:');
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

async function createListing(client, newListing) {
  const result = await client
    .db('production0')
    .collection('series')
    .insertOne(newListing);
  console.log(
    `New listing created with the following id: ${result.insertedId}`
  );
}

main().catch(console.error);

// const getTmdbApiSeriesData = async (series_id) => {
//   axios
//     .get(
//       `https://api.themoviedb.org/3/tv/${series_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
//     )
//     .then((res) => {
//       console.log(res.data.name);
//       return res.data;
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };
