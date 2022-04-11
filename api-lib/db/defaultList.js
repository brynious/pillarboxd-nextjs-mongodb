import { ObjectId } from 'mongodb';

export async function getUserSeriesStatus(db, { series_id, user_id }) {
  const cursor = await db
    .collection('user_series_status')
    .find(
      { user_id: ObjectId(user_id), series_id: ObjectId(series_id) },
      { watchlist: 1 }
    );
  const user_series_status = await cursor.toArray();

  return user_series_status[0];
}

export async function addToWatchlist(db, { series_id, user_id }) {
  const updated_doc = await db
    .collection('user_series_status')
    .findOneAndUpdate(
      { user_id: ObjectId(user_id), series_id: ObjectId(series_id) },
      { $set: { watchlist: true, watchlist_edited: new Date() } },
      { returnDocument: 'after', upsert: true }
    )
    .then(({ value }) => value);

  return updated_doc;
}

export async function removeFromWatchlist(db, { series_id, user_id }) {
  const updated_doc = await db
    .collection('user_series_status')
    .findOneAndUpdate(
      { user_id: ObjectId(user_id), series_id: ObjectId(series_id) },
      { $set: { watchlist: false, watchlist_edited: new Date() } },
      { returnDocument: 'after', upsert: true }
    )
    .then(({ value }) => value);

  return updated_doc;
}

export async function addToWatching(db, { series_id, user_id }) {
  const updated_doc = await db
    .collection('user_series_status')
    .findOneAndUpdate(
      { user_id: ObjectId(user_id), series_id: ObjectId(series_id) },
      {
        $set: {
          watchlist: false,
          watching: true,
          watchlist_edited: new Date(),
          watching_edited: new Date(),
        },
      },
      { returnDocument: 'after', upsert: true }
    )
    .then(({ value }) => value);

  return updated_doc;
}

export async function removeFromWatching(db, { series_id, user_id }) {
  const updated_doc = await db
    .collection('user_series_status')
    .findOneAndUpdate(
      { user_id: ObjectId(user_id), series_id: ObjectId(series_id) },
      { $set: { watching: false, watching_edited: new Date() } },
      { returnDocument: 'after', upsert: true }
    )
    .then(({ value }) => value);

  return updated_doc;
}

export async function addToWatched(db, { series_id, user_id }) {
  const updated_doc = await db
    .collection('user_series_status')
    .findOneAndUpdate(
      { user_id: ObjectId(user_id), series_id: ObjectId(series_id) },
      {
        $set: {
          watchlist: false,
          watching: false,
          watched: true,
          watchlist_edited: new Date(),
          watching_edited: new Date(),
          watched_edited: new Date(),
        },
      },
      { returnDocument: 'after', upsert: true }
    )
    .then(({ value }) => value);

  return updated_doc;
}

export async function removeFromWatched(db, { series_id, user_id }) {
  const updated_doc = await db
    .collection('user_series_status')
    .findOneAndUpdate(
      { user_id: ObjectId(user_id), series_id: ObjectId(series_id) },
      {
        $set: {
          watched: false,
          watched_edited: new Date(),
        },
      },
      { returnDocument: 'after', upsert: true }
    )
    .then(({ value }) => value);

  return updated_doc;
}

export async function getUserDefaultList(
  db,
  user_id,
  list_type,
  before,
  limit = 60
) {
  const sorting_prop = list_type + '_edited';

  const cursor = await db
    .collection('user_series_status')
    .aggregate([
      {
        $match: {
          user_id: ObjectId(user_id),
          [list_type]: true,
          ...(before && { [sorting_prop]: { $lt: before } }),
        },
      },
      { $sort: { [sorting_prop]: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'tv_series',
          localField: 'series_id',
          foreignField: '_id',
          as: 'series_data',
        },
      },
      { $unwind: '$series_data' },
      {
        $project: {
          series_id: 1,
          user_id: 1,
          tmdb_id: '$series_data.tmdb_id',
          poster_path: '$series_data.poster_path',
          name: '$series_data.name',
          slug: '$series_data.slug',
          [sorting_prop]: 1,
        },
      },
    ])
    .toArray();

  return cursor;
}
