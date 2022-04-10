const { MongoClient } = require('mongodb');
require('dotenv').config();

const main = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const cursor = await client
      .db('production0')
      .collection('users')
      .aggregate([
        {
          $match: {
            name: 'Bryn',
          },
        },
        {
          $lookup: {
            from: 'tv_series',
            localField: 'seriesId',
            foreignField: 'tv_series._id',
            as: 'series',
          },
        },
        {
          $project: {
            name: 1,
            slug: 1,
            watchlist: 1,
          },
        },
      ])
      .toArray();

    console.log({ cursor });
    console.log(cursor[0].watchlist);

    return cursor;
  } catch (e) {
    console.error(e);
  } finally {
    // console.log('Client would close here but needs fix.');
    console.log('Client closed.');
    client.close();
  }
};

main().catch(console.error);
