const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config();

const main = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    fs.readdirSync('cache');
  } catch (e) {
    fs.mkdirSync('cache');
  }

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    const cursor = client
      .db('production0')
      .collection('tv_series')
      .find({})
      .project({ name: 1, slug: 1 });
    const allSeries = await cursor.toArray();
    const fileContents = `export const series = ${JSON.stringify(allSeries)}`;

    fs.writeFile('cache/data.js', fileContents, function (err) {
      // writing to the cache/data.js file
      if (err) return console.log(err);
      console.log('Series cached.');
    });
  } catch (e) {
    console.error(e);
  } finally {
    console.log('Client closed');
    client.close();
  }
};

main().catch(console.error);
