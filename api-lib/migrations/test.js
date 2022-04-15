// import ObjectId from 'mongodb';
const { ObjectId } = require('mongodb');

const { MongoClient } = require('mongodb');

require('dotenv').config();

const main = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const limit = 10;

    const cursor = await client
      .db('production0')
      .collection('tv_seasons')
      .aggregate([
        {
          $set: {
            year: {
              $dateFromString: { dateString: '$air_date', format: '%Y-%m-%d' },
            },
            year1: '$air_date',
            year2: {
              $year: {
                $dateFromString: {
                  dateString: '$air_date',
                  format: '%Y-%m-%d',
                },
              },
            },
          },
        },
        { $limit: 10 },
      ])
      .toArray();

    console.log({ cursor });

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
