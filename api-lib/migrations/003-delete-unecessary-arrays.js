const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const main = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const filter = {
      // _id: ObjectId('6211922b41786a80623154b6'),
      // air_date: { $ne: '' },
    };

    const updateDoc = {
      $unset: 'episodes',
    };

    const cursor = await client
      .db('production0')
      .collection('tv_seasons')
      .updateMany(filter, [updateDoc]);

    console.log(`Updated ${cursor.modifiedCount} documents`);
  } catch (e) {
    console.error(e);
  } finally {
    // console.log('Client would close here but needs fix.');
    console.log('Client closed.');
    client.close();
  }
};

main().catch(console.error);
