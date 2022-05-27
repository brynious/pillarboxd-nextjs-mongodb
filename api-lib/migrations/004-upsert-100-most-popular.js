const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const main = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const seriesId = ObjectId('6274f7dc5f5427556b18ca9c');

    await client
      .db('production0')
      .collection('tv_series')
      .deleteMany({ _id: seriesId });

    await client
      .db('production0')
      .collection('tv_seasons')
      .deleteMany({ series_id: seriesId });

    await client
      .db('production0')
      .collection('tv_episodes')
      .deleteMany({ series_id: seriesId });
  } catch (e) {
    console.error(e);
  } finally {
    console.log('Client closed');
    client.close();
  }
};

main().catch(console.error);
