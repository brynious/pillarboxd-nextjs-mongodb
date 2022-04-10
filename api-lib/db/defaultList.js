import { ObjectId } from 'mongodb';

export async function getUserSeriesStatus(db, { series_id, user_id }) {
  const userSeriesStatus = await db
    .collection('user_series_status')
    .find(
      { user_id: ObjectId(user_id), series_id: ObjectId(series_id) },
      { watchlist: 1 }
    );

  return userSeriesStatus;
}

export async function insertToDefaultList(
  db,
  { series_id, user_id, default_list }
) {
  const updatedUser = await db
    .collection('user_series_status')
    .updateOne(
      { user_id: ObjectId(user_id), series_id: ObjectId(series_id) },
      { $set: { [default_list]: true, added_to_watchlist: new Date() } },
      { returnDocument: 'after', upsert: true }
    );

  return updatedUser.value;
}
